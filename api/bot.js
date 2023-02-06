const TelegramBot = require("node-telegram-bot-api");
const {
  handleName,
  handleSearch,
  handleStart,
  handleHelp,
} = require("../bot/command_handler.js");

const cmd_map = {
  name: handleName,
  search: handleSearch,
  start: handleStart,
  help: handleHelp,
};
const cmd_factory = ({ cmd, action, option, id, bot }) => {
  if (cmd_map.hasOwnProperty(cmd)) {
    cmd_map[cmd]({ cmd, action, option, id, bot });
  } else {
    bot.sendMessage(id, "你在找 @akajs_bot 小助手咩？发送 /help 查看帮助");
  }
};

module.exports = async (request, response) => {
  try {
    const tgToken = process.env.TG_TOKEN;
    const tgChatId = process.env.TG_CHAT_ID;
    // const org_chat_id = tgChatId.toString().slice(4);

    const bot = new TelegramBot(tgToken);

    const { body } = request;
    if (body.message) {
      const {
        chat: { id },
        text,
      } = body.message;

      const t = text.trim();
      const pattern =
        /^\/([\w\u4e00-\u9fa5@]+)(?:\s([\w\u4e00-\u9fa5]+))?(?:-(.+))?$/u;
      const match = pattern.exec(t);
      if (match) {
        const [, org_cmd, action, option] = match;
        const cmd = org_cmd.split("@")[0];

        cmd_factory({ cmd, action, option, id, bot });
        // switch (cmd) {
        //   case "start":
        //     handleStart({ cmd, id, bot });
        //     break;
        //   case "name":
        //     handleName({ cmd, id, bot });
        //     break;
        //   case "s":
        //     handleSearch({ cmd, action, option, id, bot });
        //     break;
        //   case "help":
        //     handleHelp({ cmd, id, bot });
        //     break;
        //   default:
        //     bot.sendMessage(
        //       id,
        //       "你在找@akajs_bot小助手咩？发送 /help 查看帮助"
        //     );
        // }
      }
    }
    response.send("der");
  } catch (error) {
    return response.send(error);
  }
};
