const cron = require("node-cron");

const cronJobs = (bot, chat_id, fuckTheStateClient) => {
  cron.schedule("*/10 * * * *", async () => {
    try {
      const hasPending = await fuckTheStateClient.hasPendingNegociations();
      if (hasPending) return bot.telegram.sendMessage(chat_id, `HasPending? ${hasPending}`);
      return;
    } catch (error) {
      console.log(error.message);
      return bot.telegram.reply("ERROR");
    }
  });
};

module.exports = cronJobs;
