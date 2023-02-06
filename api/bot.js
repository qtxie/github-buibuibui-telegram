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
  try {
    const tgToken = process.env.TG_TOKEN;
    const tgChatId = process.env.TG_CHAT_ID;

    const bot = new TelegramBot(tgToken);

    const { body } = request;
    // Todo
    if (body.message && body.message.text.startsWith("/")) {
      console.log("请求日志:", body);
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
        const reply_to = `回复 ${username} 指令 /${cmd}\n`;
        const msg_head = `${reply_to}${"-".repeat(reply_to.length ?? 10)}`;
        cmd_factory({ msg_head, cmd, action, option, id, bot });
      }
    }

    response.send("der");
  } catch (error) {
    return response.send(error);
  }
};
