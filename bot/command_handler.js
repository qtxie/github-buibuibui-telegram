// const TgOpenApi = require("../utils/tg_open_apis.js");

const message_option = { parse_mode: "Markdown" };

module.exports.handleStart = async ({ cmd, id, bot }) => {
  // sendMessage Api see https://github.com/yagop/node-telegram-bot-api/blob/master/doc/api.md#telegrambotsendmessagechatid-text-options--promise
  bot.sendMessage(id, "hello hello", message_option);
};
module.exports.handleName = async ({ cmd, id, bot }) => {
  bot.sendMessage(id, "yesmore", message_option);
};
module.exports.handleSearch = async ({ cmd, action, option, id, bot }) => {
  bot.sendMessage(id, `search: ${action} - ${option}`, message_option);
};
module.exports.handleHelp = async ({ cmd, id, bot }) => {
  const content = () => `
欢迎使用 Aka 小助手 :>\n
命令列表：
/help - 查看帮助
/start - 激活
/s (option) - 资源搜索
    `;
  bot.sendMessage(id, content(), message_option);
};
module.exports.handleUnknowCmd = ({ id, bot }) => {
  bot.sendMessage(
    id,
    "你在找 @akajs_bot 小助手咩？\n发送 /help 查看帮助.",
    message_option
  );
};
