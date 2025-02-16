const TelegramBot = require("node-telegram-bot-api");

// Берем токен из переменной окружения
const TOKEN = process.env.BOT_TOKEN;
const GAME_URL = process.env.GAME_URL;

// Запускаем бота
const bot = new TelegramBot(TOKEN, { polling: true });

console.log("Бот запущен!");

// Обрабатываем команду /start и /play
bot.onText(/\/start|\/play/, (msg) => {
    const chatId = msg.chat.id;

    const keyboard = {
        reply_markup: {
            inline_keyboard: [
                [{ text: "🎮 Играть", web_app: { url: GAME_URL } }]
            ]
        }
    };

    bot.sendMessage(chatId, "Запускаем игру!", keyboard);
});
