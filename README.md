# Github buibuibui Telegram

![](thumbnail.png)

基于 Github Webhooks + Vercel's Serverless API + Telegram Bot, 向 Telegram 推送仓库消息。

> 效果：你给仓库 [yesmore/aka.js](https://github.com/yesmore/aka.js) 点了 star，你的 telegram 频道/组将会收到一个包含各种元数据(可选)的点赞信息, 其他 github event 类似。
>
> 这是部署在我的 tg 群组([https://t.me/yesmore_cc](https://t.me/yesmore_cc))推送，欢迎加入～

## 使用 Vercel 部署

步骤由简入深，包含三大平台：**Github** / **Telegram** / **Vercel**，请提前注册账号，教程将根据所需[环境变量](#Vercel-Environment-variables-环境变量)依次进行讲解。

**大家跟我这样做**：

- **第一步，创建 tg 机器人并获取 `TG_TOKEN`**。打开 Telegram，搜索 [@BotFather](https://t.me/BotFather) 创建属于你的机器人，BotFather 是 tg 的机器人老大，可以帮你创建小机器人，根据他的指引创建即可。在创建成功后（即设置好机器人昵称后），BotFather 会发送一条消息，里面包含了 HTTP API Token，就是 TG_TOKEN。后续将通过此机器人向 tg 群组/频道推送消息
- **第二步，创建 tg 群组/频道并获取 `TG_CHAT_ID`**。`TG_CHAT_ID` 即群组/频道 id，tg id 一般不是显式的，可以通过 Google 搜索如何获取对应 id，这里推荐一个获取 id 的 tg bot [@username_to_id_bot](https://t.me/username_to_id_bot)，添加后向其发送你的群组/频道唯一名称即可获取
- **第三步，生成 Payload URL（即发送 Post 请求的目标 Api），你有两个选择**。在选择之前，讲解一下最后两个参数的作用。`GH_HOOK_SECRET` 用于验证请求是否来自 github，所以有两个地方会用到，在创建 Github Webhooks 时（Secret field，**非必填**），和填写 Vercel 环境变量时，后续将会将到；`PROD` 是 Vercel 环境变量之一，用于判断是否部署到生产环境。`GH_HOOK_SECRET` 与 `PROD` 可以是互斥的，即**方案一**：不填写 `GH_HOOK_SECRET`（上述两个地方都不填），同时把 `PROD` 设置为 **false**，因为非 production 环境会忽略 secrt 校验；**方案二**：填写 `GH_HOOK_SECRET`，`PROD` 设置为 **true**
- **第四步，如果你选择方案一**。点击下方的 **Deploy** 按钮开始部署到 Vercel。此按钮的行为是：跳转到 Vercel 部署页面，提示你克隆本[仓库](https://github.com/yesmore/gh-buibuibui-tg)到你的 Github 账号下，输入仓库名称后（可同名，本质就是 fork 此仓库），点击 create，然后填写 Environment variables 环境变量，注意 `PROD` 设置为 **false**，点击部署
- **第五步，如果选择方案二**（若已经用方案一部署过，可以编辑修改 Vercel 环境变量即可）。根据文档 [Github Webhooks](https://docs.github.com/zh/developers/webhooks-and-events/webhooks/about-webhooks)，
`GH_HOOK_SECRET` 需要手动生成，在终端中执行 `ruby -rsecurerandom -e 'puts SecureRandom.hex(20)'`，并保存，接着同方案一操作，注意环境变量 `PROD` 设置为 **true**，并填写 `GH_HOOK_SECRET`。部署成功后，`Payload URL` 就是你的 vercel 预览地址：[https://your-github-repo-name.vercel.app/api]()，将下一步创建 Hook 使用
- **第六步，为仓库创建 Webhook**，在你想监听的 Github 仓库中，点击 Setting，侧边栏点击 Webhooks，然后点击 add 创建，第一个参数 Payload URL 在第四/五步中获取；Content type 必须为 **application/json**；Secret 按照上述，方案一不用填，方案二填写即可；最后，下方选择中“Which events would you like to trigger this webhook?”，选择你需要监听的仓库事件，然后创建即可，第一次创建会触发一个 Ping 事件，测试是否生效

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fyesmore%2Fgh-buibuibui-tg&env=TG_TOKEN,TG_CHAT_ID,GH_HOOK_SECRET,PROD&envDescription=Environment%20variables%20needed%20to%20setup%20notifier&envLink=https%3A%2F%2Fgithub.com%2Fyesmore%2Fgh-buibuibui-tg%23environment-variables&project-name=gh-buibuibui-tg&repo-name=gh-buibuibui-tg)

### Vercel Environment variables 环境变量

| Name             | Description                                | Example                                          |
| ---------------- | ------------------------------------------ | ------------------------------------------------ |
| `TG_TOKEN`       | Telegram Bot Token                         | `0123456789:ZBX2mpx9Wjg4iqAs6izMKDXVgVV92dtOA0a` |
| `TG_CHAT_ID`     | Telegram Chat ID to which updates are sent | `9876543210`                                     |
| `GH_HOOK_SECRET` | Github Hook Secret                         | `my github hook seret`                           |
| `PROD`           | Production deployment or not               | `true`                                           |

查看我的部署效果：[https://t.me/yesmore_cc](https://t.me/yesmore_cc)

### Handlers

目前支持以下 event：




## 参考资料

- [关于 Github Webhooks](https://docs.github.com/zh/developers/webhooks-and-events/webhooks/about-webhooks)
- [仓库事件 Github Webhooks events ](https://docs.github.com/zh/developers/webhooks-and-events/webhooks/webhook-events-and-payloads)

## 开源许可

gh-buibuibui-tg is open source software licensed as GPL.