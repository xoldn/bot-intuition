const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const TOKEN = process.env.BOT_TOKEN;
const GAME_URL = process.env.GAME_URL;
const SERVER_URL = process.env.GAME_URL;

const bot = new TelegramBot(TOKEN, { polling: true });

console.log("Бот запущен!");

// Запуск игры
bot.onText(/\/start|\/play/, (msg) => {
    const chatId = msg.chat.id;

    const keyboard = {
        reply_markup: {
            inline_keyboard: [
                [{ text: "🎮 Играть", callback_game: {} }]
            ]
        }
    };

    bot.sendGame(chatId, keyboard);
});

// Обработка callback_query для запуска игры
bot.on("callback_query", (query) => {
    if (query.game_short_name) {
        const userId = query.from.id;
        const username = query.from.username || "Игрок";
        const gameUrlWithParams = `${GAME_URL}?user_id=${userId}&username=${username}`;

        bot.answerCallbackQuery(query.id, { url: gameUrlWithParams });
    }
});

// Получение рейтинга игроков после игры
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
            leaderboardText += `${index + 1}. ${player.username}: ✅ ${player.correct} | ❌ ${player.wrong}\n`;
        });

        bot.sendMessage(chatId, leaderboardText);
    } catch (error) {
        console.error("Ошибка при получении топ-игроков:", error);
        bot.sendMessage(chatId, "⚠ Ошибка при получении данных.");
    }
});
