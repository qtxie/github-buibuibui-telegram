const message_option = { parse_mode: "Markdown" };

module.exports.handleStart = async ({ cmd, id, bot }) => {
  await bot.sendMessage(id, "hello hello", message_option);
};
module.exports.handleName = async ({ cmd, id, bot }) => {
  await bot.sendMessage(id, "yesmore", message_option);
};
module.exports.handleSearch = async ({ cmd, action, option, id, bot }) => {
  await bot.sendMessage(id, `search: ${action - option}`, message_option);
};
module.exports.handleBotRepo = async ({ cmd, id, bot }) => {
  await bot.sendMessage(
    id,
    "机器人仓库：[yesmore/github-buibuibui-telegram](https://github.com/yesmore/github-buibuibui-telegram)",
    message_option
  );
};
module.exports.handleHelp = async ({ cmd, id, bot }) => {
  const content = `欢迎使用 Aka 机器人 :>\n\n
     支持的命令：
     - /help 查看帮助
     - /repo 机器人仓库
     - /s [option] 资源搜索
     - /start ...
    `;
  await bot.sendMessage(id, content, message_option);
};
