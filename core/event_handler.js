const { cl, capitalizeFirstLetter } = require("../utils/index.js");

const user_name = (sender) => `[${cl(sender.login)}](${sender.html_url})`;

// Support event handles. All Webhook events see:
// https://docs.github.com/en/developers/webhooks-and-events/webhook-events-and-payloads
const handlePing = ({ body, type_msg, sender }) => {
  const zen = cl(body.zen);
  return type_msg + `Zen: ${zen}`;
};
const handleStar = ({ body, action, type_msg, sender }) => {
  const done =
    action === "created" ? "just starred :)" : "unstarred :(";
  return type_msg + user_name(sender) + ` ${done}`;
};
const handlePush = ({ body, action, type_msg, sender, repo_html_url }) => {
  const ref = body.ref.split("/", 3)[2];
  const commits = body.commits;
  const compare = body.compare;

  commits_str = commits.length > 1 ? "commits" : "commit";

  return (
    "*Push* - " + type_msg +
    user_name(sender) +
    ` pushed [${commits.length} ${commits_str}](${compare}) to [${ref}](${repo_html_url}/tree/${ref})`
  );
};
const handleFork = ({ body, type_msg, sender }) => {
  const forkee = body.forkee;
  return (
    type_msg +
    user_name(sender) +
    ` forked to [${cl(forkee.full_name)}](${forkee.html_url})`
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
    "*Repository* - " + type_msg +
    `[${cl(sender.login)}](${
      sender.html_url
    }) ${action} [${repo_full_name}](${repo_html_url})`
  );
};
const handleIssues = ({ body, type_msg, sender }) => {
  const issue = body.issue ? body.issue : body.pull_request;
  const name = body.issue ? "issue" : "pull request";

  if (body.action === "opened" || body.action === 'closed') {
    return (
      `*${capitalizeFirstLetter(name)} ${capitalizeFirstLetter(body.action)}* - ` +
      type_msg +
      user_name(sender) +
      ` ${body.action} [${name}#${issue.number}](${issue.html_url}): ${issue.title}`
    );
  }

  // if (body.action === "assigned") {
  //   return (
  //     type_msg +
  //     user_name(body.sender) +
  //     ` ${body.action} [${name}#${issue.number}](${issue.html_url}): ${issue.title}\n` +
  //     `to: ` + user_name(body.assignee)
  //   );
  // }

  // if (body.action == "ready_for_review") {
  //   return (
  //     type_msg +
  //     `[${name}#${issue.number}](${issue.html_url}): ${issue.title}\n` +
  //     "is ready for review."
  //   );
  // }
};
const handleIssueComment = ({ body, type_msg }) => {
  const issue = body.issue;
  const comment = body.comment;

  if (body.action === "created") {
    const name = issue.pull_request ? "pull request" : "issue";
    return (
      `*Comment* - ` +
      type_msg +
      user_name(comment.user) +
      ` ${body.action} [comment](${comment.html_url}) on [${name}#${issue.number}](${issue.html_url}):\n\n` +
      `${comment.body}\n`
    );
  }
};

const handleWorkflowRun = ({ body, type_msg }) => {
  const run = body.workflow_run;

  if (body.action === "completed" && run.conclusion === 'failure') {
    const commit = run.head_commit;
    return (
      "*Workflow Run Failed* - " + type_msg +
      `[workflow run#${run.run_number}](${run.html_url}) failed!\n\n` +
      `head commit: ${commit.message}`
    );
  }
};

const handleTouch = ({ body, type_msg, sender }) => {
  return `${type_msg}(Unhandled)\n\n` + `${user_name(sender)} done`;
};

// Webhook events
// see https://docs.github.com/zh/developers/webhooks-and-events/webhooks/webhook-events-and-payloads
const strategyMap = {
  ping: handlePing,
  //star: handleStar,
  push: handlePush,
  //fork: handleFork,
  repository: handleRepository,
  issues: handleIssues,
  issue_comment: handleIssueComment,
  pull_request: handleIssues,
  workflow_run: handleWorkflowRun,
  project: handleTouch,
};

const Factory = ({
  gh_event,
  body,
  action,
  type_msg,
  sender,
  repo_full_name,
  repo_html_url,
  organization,
}) => {
  if (strategyMap.hasOwnProperty(gh_event)) {
    return strategyMap[gh_event]({
      body,
      action,
      type_msg,
      sender,
      repo_full_name,
      repo_html_url,
      gh_event,
      organization,
    });
  } else {
    // return handleTouch({ body, type_msg, sender });
  }
};

module.exports.eventHandler = async function (gh_event, body) {
  const action = cl(body.action);
  const repo = body.repository;
  const repo_full_name = cl(repo.full_name);
  const repo_html_url = repo.html_url;
  const sender = body.sender;
  const organization = body.organization;
  // const installation = cl(body.installation);

  const type_msg =
    `[${repo_full_name}](${repo_html_url})\n\n`;

  return Factory({
    gh_event,
    body,
    action,
    type_msg,
    sender,
    repo_full_name,
    repo_html_url,
    organization,
  });
};
