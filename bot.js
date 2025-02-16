const TelegramBot = require("node-telegram-bot-api");

// Используем токен бота из BotFather
const TOKEN = process.env.BOT_TOKEN;
const bot = new TelegramBot(TOKEN, { polling: true });

bot.on("message", (msg) => {
    bot.sendMessage(msg.chat.id, `Привет, ${msg.from.first_name}! Я работаю на Render 🚀`);
});

console.log("Бот запущен!");
