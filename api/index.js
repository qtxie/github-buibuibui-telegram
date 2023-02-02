const event = require("../core/event_handler.js");
const sendMsg = require("../core/send_msg.js");
const verifyWebhook = require("../core/verify_webhook.js");

// The main, exported, function of the endpoint,
// dealing with the request and subsequent response
module.exports = async (req, res) => {
  const body = req.body;
  const method = req.method;
  const gh_event = req.headers["x-github-event"];
  const gh_sig = req.headers["x-hub-signature"];
  const gh_sig_256 = req.headers["x-hub-signature-256"];

  if (method === "POST" && verifyWebhook.verifyWebhook(body, gh_sig_256)) {
    event.eventHandler(gh_event, body).then((Msg) => {
      sendMsg
        .sendMsg(Msg)
        .then(() => {
          res.status(201).send({ status: "ok" });
        })
        .catch((err) => {
          console.log(err);
          res.status(err.response.status).send(err.response.statusText);
        });
    });
  } else {
    res.status(403).send();
  }
};
