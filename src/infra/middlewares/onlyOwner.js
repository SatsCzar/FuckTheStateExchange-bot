require("dotenv-safe").config();

module.exports = (ctx, next) => {
  console.log(ctx.chat.id);
  if (ctx.chat.id == process.env.OWNER_CHAT_ID) return next();
  return ctx.reply("Is not owner");
};
