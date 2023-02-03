const axios = require("axios");

const tgToken = process.env.TG_TOKEN;
// const hookUrl = "https://gh-buibuibui-tg.vercel.app/api/bot";

module.exports.setTelegramWebhook = async function setTelegramWebhook(url) {
  const apiUrl = `https://api.telegram.org/bot${tgToken}/setWebhook`;
  const res = await axios.post(apiUrl, {
    url: url,
  });
  console.log(res.data);
};
