const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

// Берем токены из переменных окружения
const TOKEN = process.env.BOT_TOKEN;
const GAME_URL = process.env.GAME_URL;
const SERVER_URL = process.env.GAME_URL; // URL сервера игры

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

// Обрабатываем запуск игры через callback_query
bot.on("callback_query", (query) => {
    if (query.game_short_name) {
        const userId = query.from.id;
        const username = query.from.username || "Игрок";

        // Формируем ссылку с user_id для WebApp
        const gameUrlWithParams = `${GAME_URL}?user_id=${userId}&username=${username}`;

        bot.answerCallbackQuery(query.id, { url: gameUrlWithParams });
    }
});

// Команда /top для отображения списка лучших игроков
bot.onText(/\/top/, async (msg) => {
    const chatId = msg.chat.id;

    try {
        const response = await axios.get(`${SERVER_URL}/leaderboard`);
        const leaderboard = response.data;

        if (!leaderboard.length) {
            return bot.sendMessage(chatId, "⏳ Пока нет результатов.");
        }

        let leaderboardText = "🏆 **Топ игроков:**\n";
        leaderboard.forEach((player, index) => {
            leaderboardText += `${index + 1}. ${player.username}: ${player.score} очков\n`;
        });

        bot.sendMessage(chatId, leaderboardText);
    } catch (error) {
        console.error("Ошибка при получении топ-игроков:", error);
        bot.sendMessage(chatId, "⚠ Ошибка при получении данных.");
    }
});