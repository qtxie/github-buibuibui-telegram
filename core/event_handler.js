// Webhook events
// see https://docs.github.com/en/developers/webhooks-and-events/webhook-events-and-payloads
const { Expecial_Senders } = require("./constants.js");

const cl = (text) => {
  if (!text) return "";
  if (text === Expecial_Senders.Github_Action_Bot.org)
    return Expecial_Senders.Github_Action_Bot.want;
  return text
    .replace("_", "\\_")
    .replace("*", "\\*")
    .replace("[", "\\[")
    .replace("]", "\\]");
};

/** support event handles */
const handleStar = ({ body, action, type_msg, sender }) => {
  const done =
    action === "created" ? "刚刚点了一个赞 :)" : "悄咪咪取消了点赞 :(";
  return type_msg + `[${cl(sender.login)}](${sender.html_url}) ${done}`;
};
const handlePing = ({ body, type_msg, sender }) => {
  const zen = cl(body.zen);
  return type_msg + `Zen: ${zen}`;
};
const handlePush = ({ body, action, type_msg, sender, repo_html_url }) => {
  const ref = body.ref.split("/", 3)[2];
  const commits = body.commits;
  const compare = body.compare;

  commits_str = "";
  for (let commit of commits) {
    commits_str = commits_str + `[${commit.message}](${commit.url})\n`;
  }

  return (
    type_msg +
    `[${cl(sender.login)}](${sender.html_url})` +
    ` pushed to [${ref}](${repo_html_url}/tree/${ref}) with ${commits.length} commits ` +
    `([compare](${compare})).` +
    `\n\n*Commits:* ${commits_str}`
  );
};
const handleFork = ({ body, type_msg, sender }) => {
  const forkee = body.forkee;
  return (
    type_msg +
    `[${cl(sender.login)}](${sender.html_url}) forked to [${cl(
      forkee.full_name
    )}](${forkee.html_url}) at ${forkee.created_at}`
  );
};
const handleRepository = ({
  body,
  type_msg,
  sender,
  repo_full_name,
  repo_html_url,
}) => {
  return (
    type_msg +
    `[${cl(sender.login)}](${
      sender.html_url
    }) ${action} [${repo_full_name}](${repo_html_url})`
  );
};

const strategyMap = {
  ping: handlePing,
  star: handleStar,
  push: handlePush,
  fork: handleFork,
  repository: handleRepository,
};

const Factory = ({
  gh_event,
  body,
  action,
  type_msg,
  sender,
  repo_full_name,
  repo_html_url,
}) => {
  return strategyMap[gh_event]({
    body,
    action,
    type_msg,
    sender,
    repo_full_name,
    repo_html_url,
  });
};

module.exports.eventHandler = async function (gh_event, body) {
  const action = cl(body.action);
  const repo = body.repository;
  const repo_full_name = cl(repo.full_name);
  const repo_html_url = repo.html_url;
  const sender = body.sender;
  const organization = body.organization;
  const installation = cl(body.installation);

  const type_msg =
    `操作: *${cl(gh_event).toUpperCase()}*` +
    `\n仓库: [${repo_full_name}](${repo_html_url})\n\n`;

  const result = Factory({
    gh_event,
    body,
    action,
    type_msg,
    sender,
    repo_full_name,
    repo_html_url,
  });
  return result;
};
