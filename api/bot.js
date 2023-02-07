const TelegramBot = require("node-telegram-bot-api");
const {
  handleSearch,
  handleStart,
  handleHelp,
  handleUnknowCmd,
} = require("../bot/command_handler.js");

const pattern =
  /^\/([\w\u4e00-\u9fa5@]+)(?:\s([\w\u4e00-\u9fa5]+))?(?:-(.+))?$/u;
const message_option = { parse_mode: "Markdown" };
const cmd_map = {
  s: async ({ msg_head, action, option, id, bot }) => {
    await bot.sendMessage(
      id,
      `${msg_head}\nsearch: ${action} - ${option}`,
      message_option
    );
  },
  start: async ({ msg_head, id, bot }) => {
    await bot.sendMessage(id, `${msg_head}\nhello hello`, message_option);
  },
  help: async ({ msg_head, id, bot }) => {
    const content = () => `
${msg_head}
欢迎使用 Aka 小助手 :>\n
指令列表：
/help - 查看帮助
/start - 激活
/s (option) - 资源搜索
    `;
    await bot.sendMessage(id, content(), message_option);
  },
};
const cmd_factory = async ({ msg_head, cmd, action, option, id, bot }) => {
  if (cmd_map.hasOwnProperty(cmd)) {
    await cmd_map[cmd]({ msg_head, cmd, action, option, id, bot });
  } else {
    await bot.sendMessage(
      id,
      "你在找 @akajs_bot 小助手咩？\n发送 /help 查看帮助.",
      message_option
    );
  }
};

module.exports = async (request, response) => {
  console.log("请求日志:", request, request.body);
  const tgToken = process.env.TG_TOKEN;
  const bot = new TelegramBot(tgToken);
  try {
    const { body } = request;
    if (
      body.message &&
      body.message.text &&
      body.message.text.startsWith("/")
    ) {
      const {
        chat: { id },
        from,
        text,
      } = body.message;

      const username = from.username
        ? `@${from.username}`
        : `@${from.first_name} ${from.last_name}`;

      const t = text.trim();
      const match = pattern.exec(t);
      if (match) {
        const [, org_cmd, action, option] = match;
        const cmd = org_cmd.split("@")[0];
        const msg_head = `回复 ${username} 指令 /${cmd}:\n`;
        // cmd_factory({ msg_head, cmd, action, option, id, bot })
        await bot.sendMessage(
          id,
          `${msg_head}\n你在找 @akajs_bot 小助手咩？\n发送 /help 查看帮助.`,
          message_option
        );
      }
    }
    // response.status(403).send();
  } catch (error) {
    response.status(503).send(error);
  }
  response.status(201).send();
};
