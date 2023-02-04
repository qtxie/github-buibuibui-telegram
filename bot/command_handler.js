module.exports.handleStart = async ({ cmd, id, bot }) => {
  await bot.sendMessage(id, "hello hello");
};
module.exports.handleName = async ({ cmd, id, bot }) => {
  await bot.sendMessage(id, "yesmore");
};
module.exports.handleSearch = async ({ cmd, id, bot }) => {
  await bot.sendMessage(id, "search");
};
module.exports.handleUnCmd = async ({ cmd, id, bot }) => {
  await bot.sendMessage(id, "未知命令");
};
