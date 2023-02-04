const message_option = { parse_mode: "Markdown" };

module.exports.handleStart = async ({ cmd, id, bot }) => {
  await bot.sendMessage(id, "hello hello", message_option);
};
module.exports.handleName = async ({ cmd, id, bot }) => {
  await bot.sendMessage(id, "yesmore", message_option);
};
module.exports.handleSearch = async ({ cmd, action, id, bot }) => {
  await bot.sendMessage(id, `search: ${action}`, message_option);
};
module.exports.handleUnRegistedCmd = async ({ cmd, id, bot }) => {
  await bot.sendMessage(
    id,
    "![ememe](https://avatars.githubusercontent.com/u/89140804?s=400&u=51e421ccfe9f90b76625788fb80457eafdac7f86&v=4)",
    message_option
  );
};
module.exports.handleHelp = async ({ cmd, id, bot }) => {
  await bot.sendMessage(id, "机器人说明...", message_option);
};
