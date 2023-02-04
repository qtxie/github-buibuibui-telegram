const TelegramBot = require("node-telegram-bot-api");
const {
  handleName,
  handleSearch,
  handleStart,
  handleUnRegistedCmd,
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
      let match = pattern.exec(text.trim());
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
            await handleSearch({ cmd, action, id, bot });
            break;
          case "test":
            await handleUnRegistedCmd({ cmd, id, bot });
          case "help":
          default:
            await handleHelp({ cmd, id, bot });
        }
      }
    }
  } catch (error) {
    response.send("something wrong!");
  }

  response.send("OK");
};
