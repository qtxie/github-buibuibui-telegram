const TelegramBot = require("node-telegram-bot-api");

const tgToken = process.env.TG_TOKEN;
const tgChatId = process.env.TG_CHAT_ID;

const hookUrl = "https://gh-buibuibui-tg.vercel.app/api/bot";

const bot = new TelegramBot(tgToken, { polling: true });
bot.setWebHook(`${hookUrl}/bot${tgToken}`);

bot.onText(/\/name/, (msg, match) => {
  bot.sendMessage(msg.chat.id, "yesmore");
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
