const TelegramBot = require("node-telegram-bot-api");
const {
  handleName,
  handleSearch,
  handleStart,
  handleBotRepo,
  handleHelp,
} = require("../bot/command_handler.js");

module.exports = async (request, response) => {
  try {
    const tgToken = process.env.TG_TOKEN;
    const bot = new TelegramBot(tgToken);

    const { body } = request;
    if (body.message) {
      const {
        chat: { id },
        text,
      } = body.message;

      const pattern =
        /^\/([\w\u4e00-\u9fa5]+)(?:\s([\w\u4e00-\u9fa5]+))?(?:-(.+))?$/u;
      const match = pattern.exec(text.trim());
      if (match) {
        const [, cmd, action, option] = match;
        switch (cmd) {
          case "start":
            await handleStart({ cmd, id, bot });
            break;
          case "name":
            await handleName({ cmd, id, bot });
            break;
          case "s":
            await handleSearch({ cmd, action, option, id, bot });
            break;
          case "repo":
            await handleBotRepo({ cmd, id, bot });
            break;
          case "help":
            await handleHelp({ cmd, id, bot });
            break;
          default:
            await bot.sendMessage(id, "你在找我咩？发送 /help 查看帮助");
        }
      }
    }
  } catch (error) {
    response.send("something wrong!");
  }

  response.send("OK");
};
