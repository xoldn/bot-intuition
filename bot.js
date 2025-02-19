const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const TOKEN = process.env.BOT_TOKEN;
const GAME_URL = process.env.GAME_URL;
const GAME_SHORT_NAME = process.env.GAME_SHORT_NAME; // short name установленный у бота

const bot = new TelegramBot(TOKEN, { polling: true });

console.log("Бот запущен!");

// Команда для отправки сообщения с игрой
bot.onText(/\/game/, (msg) => {
    bot.sendGame(msg.chat.id, GAME_SHORT_NAME);
});

// Запуск игры через callback_query
bot.on("callback_query", (query) => {
    if (query.game_short_name) {
        const userId = query.from.id;
        const username = query.from.username || "Игрок";
        const gameUrlWithParams = `${GAME_URL}?user_id=${userId}&username=${username}&chat_id=${query.message.chat.id}&message_id=${query.message.message_id}`;
        bot.answerCallbackQuery(query.id, { url: gameUrlWithParams });
    }
});

// Изменения внесены в обработчике "/score", добавлен параметр game_short_name
bot.on("message", (msg) => {
    if (msg.text && msg.text.startsWith("/score")) {
        const score = parseInt(msg.text.split(" ")[1]);
        // Обновление результата игры через Telegram API
        bot.setGameScore(msg.from.id, score, { 
            chat_id: msg.chat.id, 
            message_id: msg.message_id,
            game_short_name: GAME_SHORT_NAME
        })
            .then(() => {
                bot.sendMessage(msg.chat.id, `Ваш результат: ${score}`);
            })
            .catch((err) => {
                bot.sendMessage(msg.chat.id, `Ошибка при установке результата: ${err.message}`);
            });
    }
});