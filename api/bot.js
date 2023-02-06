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
const cmd_factory = ({ cmd, action, option, id, bot }) => {
  if (cmd_map.hasOwnProperty(cmd)) {
    cmd_map[cmd]({ cmd, action, option, id, bot });
  } else {
    handleUnknowCmd({ id, bot });
  }
};

module.exports = async (request, response) => {
  try {
    const tgToken = process.env.TG_TOKEN;
    const tgChatId = process.env.TG_CHAT_ID;
    // const org_chat_id = tgChatId.toString().slice(4);

    const bot = new TelegramBot(tgToken);

    const { body } = request;
    // Todo
    console.log(request);
    console.log("请求体", body);
    if (body.message) {
      const {
        chat: { id },
        text,
      } = body.message;

      const t = text.trim();
      const match = pattern.exec(t);
      if (match) {
        const [, org_cmd, action, option] = match;
        const cmd = org_cmd.split("@")[0];
        cmd_factory({ cmd, action, option, id, bot });
      }
    }
    response.send("der");
  } catch (error) {
    return response.send(error);
  }
};
