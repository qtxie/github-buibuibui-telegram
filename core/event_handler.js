const { Expecial_Senders, IgnoreTypes } = require("./constants.js");

const cl = (text) => {
  if (!text) return "";
  if (text === Expecial_Senders.Github_Action_Bot.org)
    return Expecial_Senders.Github_Action_Bot.want;
  if (IgnoreTypes.includes(text)) return text;
  return text
    .replace("_", "\\_")
    .replace("*", "\\*")
    .replace("[", "\\[")
    .replace("]", "\\]");
};
const capitalizeFirstLetter = (string) => {
  return string.replace(/^./, string[0].toUpperCase());
};
const user_name = (sender) => `[${cl(sender.login)}](${sender.html_url})`;

/**
 * Support event handles
 *
 * All Webhook events see
 *  - https://docs.github.com/en/developers/webhooks-and-events/webhook-events-and-payloads
 * */
const handlePing = ({ body, type_msg, sender }) => {
  const zen = cl(body.zen);
  return type_msg + `Zen: ${zen}`;
};
const handleStar = ({ body, action, type_msg, sender }) => {
  const done =
    action === "created" ? "刚刚点了一个赞 :)" : "悄咪咪取消了点赞 :(";
  return type_msg + user_name(sender) + ` ${done}`;
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
    user_name(sender) +
    ` pushed to [${ref}](${repo_html_url}/tree/${ref}) with ${commits.length} commits ` +
    `([compare](${compare})).` +
    `\n\n*Commits:* ${commits_str}`
  );
};
const handleFork = ({ body, type_msg, sender }) => {
  const forkee = body.forkee;
  return (
    type_msg +
    user_name(sender) +
    ` forked to [${cl(forkee.full_name)}](${forkee.html_url}) at ${
      forkee.created_at
    }`
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
const handleIssues = ({ body, type_msg, sender, repo_full_name }) => {
  const issue = body.issue;

  return (
    type_msg +
    `${capitalizeFirstLetter(body.action)} issue: [#${issue.title}「#${
      issue.number
    }」](${issue.html_url})\n` +
    `Leaving comment: ${issue.body}\n\n` +
    user_name(issue.user) +
    ` opened a issue([#${issue.number}](${issue.html_url})) ` +
    `at ${issue.created_at}`
  );
};
const handleIssueComment = ({ body, type_msg, sender, repo_full_name }) => {
  const issue = body.issue;
  const comment = body.comment;

  return (
    type_msg +
    `Issue: [#${issue.title}「#${issue.number}」](${issue.html_url})\n` +
    `Issue state: ${issue.state}\n` +
    `Total comments: ${issue.comments}\n\n` +
    user_name(comment.user) +
    ` commented on [#issue${issue.number}](${issue.html_url}): ` +
    `${comment.body}\n` +
    `at ${comment.updated_at}`
  );
};

// Webhook events
// see https://docs.github.com/en/developers/webhooks-and-events/webhook-events-and-payloads
const strategyMap = {
  ping: handlePing,
  star: handleStar,
  push: handlePush,
  fork: handleFork,
  repository: handleRepository,
  issues: handleIssues,
  issue_comment: handleIssueComment,
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
