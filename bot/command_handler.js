module.exports.handleStart = async ({ cmd, id, bot }) => {
  await bot.sendMessage(id, "hello hello");
};
module.exports.handleName = async ({ cmd, id, bot }) => {
  await bot.sendMessage(id, "yesmore");
};
module.exports.handleSearch = async ({ cmd, action, id, bot }) => {
  await bot.sendMessage(id, `search: ${action}`);
};
module.exports.handleUnRegistedCmd = async ({ cmd, id, bot }) => {
  await bot.sendMessage(id, "未知命令");
};
module.exports.handleHelp = async ({ cmd, id, bot }) => {
  await bot.sendMessage(id, "机器人说明...");
};
