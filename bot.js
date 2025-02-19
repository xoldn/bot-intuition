const TelegramBot = require('node-telegram-bot-api');
const crypto = require('crypto');

// Сохраняем рейтинг пользователей в памяти
const ranking = {};

// Храним активные игры: userId -> ответ
const activeGames = {};

const colors = ['Red', 'Blue', 'Green', 'Yellow'];

// Генерация случайного цвета с использованием crypto для повышения безопасности
function getRandomColor() {
    const index = crypto.randomInt(0, colors.length);
    return colors[index];
}

// Получаем токен из переменных окружения
const token = process.env.TELEGRAM_TOKEN;
if (!token) {
    console.error('Требуется переменная окружения TELEGRAM_TOKEN');
    process.exit(1);
}

// Создаем экземпляр бота с режимом long polling
const bot = new TelegramBot(token, { polling: true });

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    // Генерируем случайный правильный ответ
    const answer = getRandomColor();
    activeGames[userId] = answer;

    // Формируем inline клавиатуру с вариантами выбора
    const options = {
        reply_markup: {
            inline_keyboard: [
                colors.map(color => ({
                    text: color,
                    callback_data: color
                }))
            ]
        }
    };

    bot.sendMessage(chatId, "Выбери цвет карты:", options);
});

// Обработка нажатия кнопок inline клавиатуры
bot.on('callback_query', (callbackQuery) => {
    const message = callbackQuery.message;
    const userId = callbackQuery.from.id;
    const selectedColor = callbackQuery.data;
    const gameAnswer = activeGames[userId];
    
    if (!gameAnswer) {
        bot.answerCallbackQuery(callbackQuery.id, { text: "Игра не активна. Напиши /start" });
        return;
    }
    
    let responseText = "";
    if (selectedColor === gameAnswer) {
        ranking[userId] = (ranking[userId] || 0) + 1;
        responseText = `Правильно! Рейтинг: ${ranking[userId]}`;
    } else {
        responseText = `Неправильно! Правильный ответ: ${gameAnswer}. Рейтинг: ${ranking[userId] || 0}`;
    }
    
    // Очищаем активную игру для пользователя
    delete activeGames[userId];
    
    // Отправляем уведомление о результате через ответ на callback
    bot.answerCallbackQuery(callbackQuery.id, { text: responseText });
    
    // Отправляем сообщение в чат
    bot.sendMessage(message.chat.id, responseText);
});