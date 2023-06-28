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

  let commits_message = "";
  let count = 0;
  for (let i = commits.length - 1; i >= 0; i--) {
    let commit = commits[i];
    commits_message = commits_message + `• ${commit.message}\n`;
    if (++count == 3) {break;}
  }

  const more_commits = commits.length > 3 ? `\n[more commits »](${compare})` : "";

  const commits_str = commits.length > 1 ? "commits" : "commit";

  return (
    "\u{1F44D} *Push* - " + type_msg +
    user_name(sender) +
    ` pushed [${commits.length} ${commits_str}](${compare}) to [${ref}](${repo_html_url}/tree/${ref})\n\n` +
    `${commits_message}` + `${more_commits}`
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
    const mark = body.action === "opened" ? "\u{1F680}" : "\u{270C}";
    return (
      `${mark} *${capitalizeFirstLetter(name)} ${capitalizeFirstLetter(body.action)}* - ` +
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
const handleDiscussion = ({ body, type_msg, sender }) => {
  const discuss = body.discussion;
  const name = "discussion";

  if (body.action === "created" || body.action === 'closed') {
    const mark = "\u{1F4AC}";
    return (
      `${mark} *${capitalizeFirstLetter(name)} ${capitalizeFirstLetter(body.action)}* - ` +
      type_msg +
      user_name(sender) +
      ` ${body.action} [${name}#${discus.number}](${discuss.html_url}): ${discuss.title}`
    );
  }
}

const handleDiscussionComment = ({ body, type_msg }) => {
  const comment = body.comment;
  const discuss = body.discussion;

  if (body.action === "created") {
    const name = "discussion";
    return (
      `\u{1F4AC} *Discussion* - ` +
      type_msg +
      user_name(comment.user) +
      ` [commented](${comment.html_url}) on [${name}#${discuss.number}](${discuss.html_url}):\n\n` +
      `${comment.body}\n`
    );
  }
};

const handleWiki = ({ body, type_msg, sender }) => {
  const pages = body.pages;

  let messages = "";
  for (let i = pages.length - 1; i >= 0; i--) {
    let page = pages[i];
    //const sha = page.sha.substring(0, 7);
    //const diff = page.html_url + `/_compare/${sha}%5E...${sha}`;
    const diff = page.html_url + `/_compare/${page.sha}`;
    const message = user_name(sender) + ` ${page.action} page [${page.title}](${diff})\n`;
    messages = messages + message;
  }

  const mark = "\u{1F4D6}";
  return (
    `${mark} *Wiki* - ` + type_msg + messages
  );
}

const handleIssueComment = ({ body, type_msg }) => {
  const issue = body.issue;
  const comment = body.comment;

  if (body.action === "created") {
    const name = issue.pull_request ? "pull request" : "issue";
    return (
      `\u{270F} *Comment* - ` +
      type_msg +
      user_name(comment.user) +
      ` [commented](${comment.html_url}) on [${name}#${issue.number}](${issue.html_url}):\n\n` +
      `${comment.body}\n`
    );
  }
};

const handleCommitComment = ({ body, type_msg }) => {
  const comment = body.comment;

  if (body.action === "created") {
    const sha = comment.commit_id.substring(0, 7);
    return (
      `\u{270F} *Comment* - ` +
      type_msg +
      user_name(comment.user) +
      ` [commented](${comment.html_url}) on [commit#${sha}](${comment.html_url}):\n\n` +
      `${comment.body}\n`
    );
  }
};

const handleWorkflowRun = ({ body, type_msg }) => {
  const run = body.workflow_run;

  if (body.action === "completed" && run.conclusion === 'failure') {
    const commit = run.head_commit;
    const repo = run.repository;
    return (
      `\u{1F525} *Workflow ${run.name} Failed* - ` + type_msg +
      `[workflow run#${run.run_number}](${run.html_url}) failed on branch [${run.head_branch}](${repo.html_url}/tree/${run.head_branch}) \u{1F622}\n\n` +
      `• ${commit.message}`
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
  discussion: handleDiscussion,
  discussion_comment: handleDiscussionComment,
  commit_comment: handleCommitComment,
  gollum: handleWiki,
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
