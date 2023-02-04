const TelegramBot = require("node-telegram-bot-api");

module.exports = async (request, response) => {
  const tgToken = process.env.TG_TOKEN;
  const tgChatId = process.env.TG_CHAT_ID;
  const bot = new TelegramBot(tgToken, { polling: true });
  try {
    const { body } = request;
    if (body.message) {
      const {
        chat: { id },
        text,
      } = body.message;

      if (text === "/name") {
        await bot.sendMessage(id, "yesmore111");
      }

      bot.onText(/\/name/, async (msg, match) => {
        await bot.sendMessage(msg.chat.id, "yesmore");
      });

      bot.on("message", (msg) => {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, "'I am alive!'");
      });

      bot.on("polling_error", (error) => {
        console.log(error.code); // => 'EFATAL'
      });

      bot.on("webhook_error", (error) => {
        console.log(error.code); // => 'EPARSE'
      });

      // const message = `✅ Thanks for your message: *"${text}"*\nHave a great day! 👋🏻`;
      // await bot.sendMessage(id, message);
    }
  } catch (error) {
    console.error("Error sending message");
    console.log(error.toString());
  }
  response.send("OK");
};
