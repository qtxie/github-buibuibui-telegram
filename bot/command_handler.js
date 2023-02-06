// const TgOpenApi = require("../utils/tg_open_apis.js");

const message_option = { parse_mode: "Markdown" };

module.exports.handleStart = async ({ cmd, id, bot }) => {
  // TgOpenApi.sendMsg("hello hello111");
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
