require("dotenv-safe").config();
const { Telegraf } = require("telegraf");
const onlyOwner = require("../middlewares/onlyOwner");

const runBot = (fuckTheStateClient) => {
  const bot = new Telegraf(process.env.BOT_TOKEN);

  bot.use(onlyOwner);

  bot.command("start", (ctx) => {
    ctx.reply("Bem vindo");
  });

  bot.command("info", async (ctx) => {
    try {
      const { data: infos } = await fuckTheStateClient.getInfo();
      console.log(infos);
      return ctx.reply(JSON.stringify(infos));
    } catch (error) {
      console.log(error.message);
      return ctx.reply("ERROR");
    }
  });

  bot.launch();
  console.log("Bot do telegram está rodando");

  return bot;
};

module.exports = runBot;
