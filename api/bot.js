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
const cmd_factory = ({ msg_head, cmd, action, option, id, bot }) => {
  if (cmd_map.hasOwnProperty(cmd)) {
    cmd_map[cmd]({ msg_head, cmd, action, option, id, bot });
  } else {
    handleUnknowCmd({ msg_head, id, bot });
  }
};

module.exports = async (request, response) => {
  // Todo
  console.log("请求日志:", request.body);
  if (
    request.body &&
    request.body.message &&
    request.body.message.text &&
    request.body.message.text.startsWith("/")
  ) {
    const tgToken = process.env.TG_TOKEN;
    const tgChatId = process.env.TG_CHAT_ID;

    const bot = new TelegramBot(tgToken);

    const { body } = request;

    const {
      chat: { id },
      from,
      text,
      date,
    } = body.message;

    const username = from.username
      ? `@${from.username}`
      : `@${from.first_name} ${from.last_name}`;

    const t = text.trim();
    const match = pattern.exec(t);
    if (match) {
      const [, org_cmd, action, option] = match;
      const cmd = org_cmd.split("@")[0];
      const msg_head = `回复 ${username} 指令/${cmd}:`;
      cmd_factory({ msg_head, cmd, action, option, id, bot });
    }
    response.status(201).send({ status: "ok" });
  } else {
    response.status(403).send();
  }
};
