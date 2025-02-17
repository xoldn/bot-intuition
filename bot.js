const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const TOKEN = process.env.BOT_TOKEN;
const GAME_URL = process.env.GAME_URL;
const SERVER_URL = process.env.GAME_URL;

const bot = new TelegramBot(TOKEN, { polling: true });

console.log("Бот запущен!");

// Запуск игры через callback_query
bot.on("callback_query", (query) => {
    if (query.game_short_name) {
        const userId = query.from.id;
        const username = query.from.username || "Игрок";
        const gameUrlWithParams = `${GAME_URL}?user_id=${userId}&username=${username}&chat_id=${query.message.chat.id}&message_id=${query.message.message_id}`;

        bot.answerCallbackQuery(query.id, { url: gameUrlWithParams });
    }
});

// Установка нового рекорда в Telegram
bot.onText(/\/setscore (.+)/, async (msg, match) => {
    const [userId, score, chatId, messageId] = match[1].split(" ");
    
    try {
        await bot.setGameScore(userId, parseInt(score), {
            chat_id: parseInt(chatId),
            message_id: parseInt(messageId),
            force: true
        });

        bot.sendMessage(chatId, `🎉 Новый рекорд! ${score} очков!`);
    } catch (error) {
        console.error("Ошибка при установке рекорда:", error);
    }
});
