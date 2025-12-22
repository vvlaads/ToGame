// Преобразуем строку даты в объект Date
export function parseDate(dateString) {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('.').map(Number);
    return new Date(year, month - 1, day);
}

// Преобразуем строку времени в объект Date (с базовой датой)
export function parseTime(timeString) {
    if (!timeString) return null;
    const parts = timeString.split(':').map(Number);
    return new Date(0, 0, 0, parts[0] || 0, parts[1] || 0, parts[2] || 0);
}

// Преобразуем дату и время сообщения в timestamp
export function getTimestamp(msg) {
    if (!msg || !msg.date || !msg.time) return 0;

    const [day, month, year] = msg.date.split('.').map(Number);
    const [hours, minutes, seconds = 0] = msg.time.split(':').map(Number);

    return new Date(year, month - 1, day, hours, minutes, seconds).getTime();
}

// Получаем последнее сообщение из массива сообщений
export function getLastMessage(messages) {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return null;
    }

    return messages.reduce((latest, current) => {
        if (!latest) return current;
        return getTimestamp(current) > getTimestamp(latest) ? current : latest;
    }, null);
}

// Форматируем время для отображения (часы:минуты)
export function formatTime(timeString) {
    if (!timeString) return '';

    const [hours, minutes] = timeString.split(':');
    return hours && minutes ? `${hours}:${minutes}` : timeString;
}

// Проверяем, сегодня ли дата
export function isToday(dateString) {
    if (!dateString) return false;

    const messageDate = parseDate(dateString);
    if (!messageDate) return false;

    const today = new Date();

    return (
        messageDate.getDate() === today.getDate() &&
        messageDate.getMonth() === today.getMonth() &&
        messageDate.getFullYear() === today.getFullYear()
    );
}

// Проверяем, вчера ли дата
export function isYesterday(dateString) {
    if (!dateString) return false;

    const messageDate = parseDate(dateString);
    if (!messageDate) return false;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return (
        messageDate.getDate() === yesterday.getDate() &&
        messageDate.getMonth() === yesterday.getMonth() &&
        messageDate.getFullYear() === yesterday.getFullYear()
    );
}

// Форматируем время или дату в зависимости от того, когда было сообщение
export function formatMessageDateTime(message) {
    if (!message || !message.date || !message.time) return '';

    if (isToday(message.date)) {
        return formatTime(message.time);
    } else if (isYesterday(message.date)) {
        return 'Вчера';
    } else {
        const [day, month, year] = message.date.split('.');
        return `${day}.${month}.${year}`;
    }
}

// Получаем информацию о последнем сообщении чата
export function getChatLastMessageInfo(chat) {
    if (!chat || !chat.messages) {
        return {
            text: 'Нет сообщений',
            datetime: '',
            fullInfo: null
        };
    }

    const lastMessage = getLastMessage(chat.messages);

    if (!lastMessage) {
        return {
            text: 'Нет сообщений',
            datetime: '',
            fullInfo: null
        };
    }

    return {
        text: `${lastMessage.username}: ${lastMessage.text}`,
        datetime: formatMessageDateTime(lastMessage),
        fullInfo: lastMessage
    };
}

// Сортировка чатов по времени последнего сообщения (новые первыми)
export function sortChatsByLastMessage(chats) {
    if (!Array.isArray(chats)) return [];

    return [...chats].sort((a, b) => {
        const lastMessageA = getLastMessage(a.messages);
        const lastMessageB = getLastMessage(b.messages);

        const timeA = lastMessageA ? getTimestamp(lastMessageA) : 0;
        const timeB = lastMessageB ? getTimestamp(lastMessageB) : 0;

        return timeB - timeA; // Новые первыми
    });
}

// Проверяем, было ли последнее сообщение в течение указанного времени
export function isLastMessageWithinTime(chat, maxHours = 1) {
    if (!chat || !chat.messages || chat.messages.length === 0) {
        return false;
    }

    const lastMessage = getLastMessage(chat.messages);
    if (!lastMessage) return false;

    const messageTimestamp = getTimestamp(lastMessage);
    const now = Date.now();
    const maxTimeInMs = maxHours * 60 * 60 * 1000;

    return (now - messageTimestamp) <= maxTimeInMs;
}

// Фильтруем чаты по времени последнего сообщения
export function filterChatsByLastMessageTime(chats, maxHours = 1) {
    if (!Array.isArray(chats)) return [];

    return chats.filter(chat => isLastMessageWithinTime(chat, maxHours));
}

// Получаем чаты с последним сообщением в пределах N часов
export function getRecentChats(chats, hours = 1) {
    return filterChatsByLastMessageTime(chats, hours);
}

// Получаем дату последнего сообщения в формате для сортировки
export function getLastMessageDate(chat) {
    const lastMessage = getLastMessage(chat?.messages);
    return lastMessage ? getTimestamp(lastMessage) : 0;
}