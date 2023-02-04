const TelegramBot = require("node-telegram-bot-api");
const TgOpenApi = require("../utils/tg_open_apis.js");

module.exports = async (request, response) => {
  try {
    const tgToken = process.env.TG_TOKEN;
    const tgChatId = process.env.TG_CHAT_ID;
    const bot = new TelegramBot(tgToken);

    bot.onText(/\/s (.+)/, async (msg, match) => {
      const chatId = msg.chat.id;
      const resp = match[1];
      await bot.sendMessage(chatId, resp);
    });

    // bot.onText(/\/name/, (msg, match) => {
    //   bot.sendMessage(msg.chat.id, "yesmore");
    // });

    bot.on("message", (msg) => {
      const chatId = msg.chat.id;
      bot.sendMessage(chatId, "'I am alive!'");
    });

    // bot.on("polling_error", (error) => {
    //   console.log(error.code); // => 'EFATAL'
    // });

    // bot.on("webhook_error", (error) => {
    //   console.log(error.code); // => 'EPARSE'
    // });

    const { body } = request;

    if (body.message) {
      const {
        chat: { id },
        text,
      } = body.message;

      if (text === "/name") {
        await bot.sendMessage(id, "yesmore111");
      }

      const message = `✅ Thanks for your message: *"${text}"*\nHave a great day! 👋🏻`;
      await bot.sendMessage(id, message);
    }
  } catch (error) {}

  response.send("OK");
};
