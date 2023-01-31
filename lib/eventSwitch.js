// Webhook events switch
// https://docs.github.com/en/developers/webhooks-and-events/webhook-events-and-payloads

function cl(text) {
  if (!text) return "";
  return text
    .replace("_", "\\_")
    .replace("*", "\\*")
    .replace("[", "\\[")
    .replace("]", "\\]");
}

module.exports.eventSwitch = async function (gh_event, body) {
  const action = cl(body.action);
  const repo = body.repository;
  const repo_full_name = cl(repo.full_name);
  const repo_html_url = repo.html_url;
  const sender = body.sender;
  const organization = cl(body.organization);
  const installation = cl(body.installation);

  msg =
    `操作: *${cl(gh_event).toUpperCase()}*` +
    `\n仓库: [${repo_full_name}](${repo_html_url})\n\n`;

  switch (gh_event) {
    case "ping": {
      const zen = cl(body.zen);
      return msg + `Zen: ${zen}`;
    }
    case "star": {
      const done =
        action === "created" ? "刚刚点了一个赞 :)" : "悄咪咪取消了点赞 :(";
      return msg + `[${cl(sender.login)}](${sender.html_url}) ${done}`;
    }
    case "push": {
      // const pusher = body.pusher
      const ref = body.ref.split("/", 3)[2];
      const commits = body.commits;
      const compare = body.compare;

      commits_str = "";
      for (commit of commits) {
        commits_str = commits_str + `[${commit.message}](${commit.url})\n`;
      }

      return (
        msg +
        `[${cl(sender.login)}](${sender.html_url})` +
        ` pushed to [${ref}](${repo_html_url}/tree/${ref}) with ${commits.length} commits ` +
        `([compare](${compare})).` +
        `\n\n*Commits Msg:* ${commits_str}`
      );
    }
    case "fork": {
      const forkee = body.forkee;
      return (
        msg +
        `[${cl(sender.login)}](${sender.html_url}) forked to [${cl(
          forkee.full_name
        )}](${forkee.html_url}) at ${forkee.created_at}`
      );
    }
    case "repository": {
      return (
        msg +
        `[${cl(sender.login)}](${
          sender.html_url
        }) ${action} [${repo_full_name}](${repo_html_url})`
      );
    }
  }
};
