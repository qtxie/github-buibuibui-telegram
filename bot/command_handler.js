module.exports.handleStart = ({ cmd, id, bot }) => {
  bot.sendMessage(id, "hello hello");
};
module.exports.handleName = ({ cmd, id, bot }) => {
  bot.sendMessage(id, "yesmore");
};
module.exports.handleSearch = ({ cmd, id, bot }) => {
  bot.sendMessage(id, "search");
};
module.exports.handleUnCmd = ({ cmd, id, bot }) => {
  bot.sendMessage(id, "未知命令");
};
