const TelegramBot = require("node-telegram-bot-api");

// Берем токен из переменной окружения
const TOKEN = process.env.BOT_TOKEN;
const GAME_URL = "https://intuition-3kyw.onrender.com/";

// Запускаем бота
const bot = new TelegramBot(TOKEN, { polling: true });

console.log("Бот запущен!");

// Обрабатываем команду /start и /play
bot.onText(/\/start|\/play/, (msg) => {
    const chatId = msg.chat.id;

    const keyboard = {
        reply_markup: {
            keyboard: [
                [{ text: "Играть", web_app: { url: GAME_URL } }]
            ],
            resize_keyboard: true
        }
    };

    bot.sendMessage(chatId, "Запускаем игру!", keyboard);
});
