// const TgOpenApi = require("../utils/tg_open_apis.js");

const message_option = { parse_mode: "Markdown" };

module.exports.handleStart = async ({ msg_head, id, bot }) => {
  // sendMessage Api see https://github.com/yagop/node-telegram-bot-api/blob/master/doc/api.md#telegrambotsendmessagechatid-text-options--promise
  bot.sendMessage(id, `${msg_head}\nhello hello`, message_option);
};
module.exports.handleName = async ({ msg_head, id, bot }) => {
  bot.sendMessage(id, `${msg_head}\nyesmore`, message_option);
};
module.exports.handleSearch = async ({ msg_head, action, option, id, bot }) => {
  bot.sendMessage(
    id,
    `${msg_head}\nsearch: ${action} - ${option}`,
    message_option
  );
};
module.exports.handleHelp = async ({ msg_head, id, bot }) => {
  const content = () => `
${msg_head}\n
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
