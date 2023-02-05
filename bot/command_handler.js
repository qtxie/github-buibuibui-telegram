const message_option = { parse_mode: "Markdown" };

module.exports.handleStart = async ({ cmd, id, bot }) => {
  await bot.sendMessage(id, "hello hello", message_option);
};
module.exports.handleName = async ({ cmd, id, bot }) => {
  await bot.sendMessage(id, "yesmore", message_option);
};
module.exports.handleSearch = async ({ cmd, action, option, id, bot }) => {
  await bot.sendMessage(id, `search: ${action} - ${option}`, message_option);
};
module.exports.handleHelp = async ({ cmd, id, bot }) => {
  const content = () => `
欢迎使用 Aka 机器人 :>\n
命令列表：
/help - 查看帮助
/s (option) - 资源搜索
/start - 注册
    `;
  await bot.sendMessage(id, content(), message_option);
};
