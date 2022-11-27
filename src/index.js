require("dotenv-safe").config();
const cronJobs = require("./infra/cron");
const FuckTheStateClient = require("./infra/repositories/FuckTheStateClient");

const fuckTheStateClient = new FuckTheStateClient(process.env.LOGIN, process.env.PASSWORD);

const botInstance = require("./infra/bot")(fuckTheStateClient);

cronJobs(botInstance, process.env.OWNER_CHAT_ID, fuckTheStateClient);
