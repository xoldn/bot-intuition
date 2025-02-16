const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

// Получаем токен бота из переменной окружения
const TOKEN = process.env.BOT_TOKEN;
const GAME_URL = process.env.GAME_URL;

if (!TOKEN) {
    console.error("❌ Ошибка: BOT_TOKEN не задан! Проверь переменные окружения.");
    process.exit(1);
}

// Создаём бота с polling
const bot = new TelegramBot(TOKEN, { polling: true });

console.log("✅ Бот успешно запущен!");

// Обработка команды /start и /play
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

    bot.sendMessage(chatId, "🚀 Запускаем игру!", keyboard);
});

// Express-сервер для Render (избегает ошибки с портом)
const app = express();
app.get("/", (req, res) => {
    res.send("Бот работает!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌍 Сервер запущен на порту ${PORT}`);
});
