const TelegramBot = require("node-telegram-bot-api");

const tgToken = process.env.TG_TOKEN;
const tgChatId = process.env.TG_CHAT_ID;

module.exports = async (req, res) => {
  const bot = new TelegramBot(tgToken, { polling: true });
  try {
    const { body } = req;
    if (body.message) {
      const {
        chat: { id },
        text,
      } = body.message;
      const message = `✅ Thanks for your message: *"${text}"*\nHave a great day! 👋🏻`;
      await bot.sendMessage(id, message, { parse_mode: "Markdown" });

      // bot.onText(/\/name/, (msg, match) => {
      //   bot.sendMessage(msg.chat.id, "yesmore");
      // });

      // bot.on("message", (msg) => {
      //   const chatId = msg.chat.id;
      //   bot.sendMessage(chatId, "'I am alive!'");
      // });

      // bot.on("polling_error", (error) => {
      //   console.log(error.code); // => 'EFATAL'
      // });

      // bot.on("webhook_error", (error) => {
      //   console.log(error.code); // => 'EPARSE'
      // });
    }
  } catch (error) {
    // If there was an error sending our message then we
    // can log it into the Vercel console
    console.error("Error sending message");
    console.log(error.toString());
  }
  res.send("OK");
};
