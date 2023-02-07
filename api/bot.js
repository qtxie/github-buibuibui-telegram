const TelegramBot = require("node-telegram-bot-api");
const {
  handleName,
  handleSearch,
  handleStart,
  handleHelp,
  handleUnknowCmd,
} = require("../bot/command_handler.js");

const pattern =
  /^\/([\w\u4e00-\u9fa5@]+)(?:\s([\w\u4e00-\u9fa5]+))?(?:-(.+))?$/u;
const cmd_map = {
  name: handleName,
  s: handleSearch,
  start: handleStart,
  help: handleHelp,
};
const cmd_factory = async ({ msg_head, cmd, action, option, id, bot }) => {
  if (cmd_map.hasOwnProperty(cmd)) {
    await cmd_map[cmd]({ msg_head, cmd, action, option, id, bot });
  } else {
    handleUnknowCmd({ msg_head, id, bot });
  }
};

module.exports = async (request, response) => {
  try {
    // Todo
    console.log("请求日志:", request, request.body);

    const tgToken = process.env.TG_TOKEN;
    const tgChatId = process.env.TG_CHAT_ID;

    const bot = new TelegramBot(tgToken);

    const { body } = request;
    if (
      body &&
      body.message &&
      body.message.text &&
      body.message.text.startsWith("/")
    ) {
      const {
        chat: { id },
        from,
        text,
      } = body.message;

      const username = from.username
        ? `@${from.username}`
        : `@${from.first_name} ${from.last_name}`;

      const t = text.trim();
      const match = pattern.exec(t);
      if (match) {
        const [, org_cmd, action, option] = match;
        const cmd = org_cmd.split("@")[0];
        const msg_head = `回复 ${username} 指令 /${cmd}:\n`;
        cmd_factory({ msg_head, cmd, action, option, id, bot })
          .then(() => {
            response.status(201).send({ status: "ok" });
          })
          .catch((err) => {
            console.log(err);
            res.status(err.response.status).send(err.response.statusText);
          });
      }
    }
    response.status(403).send({ status: "ok" });
  } catch (e) {
    return response.status(501).send(e.message);
  }
};
