const TelegramBot = require("node-telegram-bot-api");
const {
  handleName,
  handleSearch,
  handleStart,
  handleUnCmd,
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

      if (
        Object.prototype.toString.call(text) === "[object String]" &&
        text.startsWith("/")
      ) {
        const cmd = text.slice(1);
        switch (cmd.trim().toLowerCase()) {
          case "start":
            return handleStart({ cmd, id, bot });
          case "name":
            return handleName({ cmd, id, bot });
          case "s":
            return handleSearch({ cmd, id, bot });
          default:
            return handleUnCmd({ cmd, id, bot });
        }
      }
    }
  } catch (error) {
    response.send("something wrong!");
  }

  response.send("OK");
};
