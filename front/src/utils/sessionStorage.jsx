const SESSION_KEYS = {
    CURRENT_CHAT_ID: 'CURRENT_CHAT_ID',
    CURRENT_ROOM_ID: 'CURRENT_ROOM_ID'
};

// Сохраняем ID текущего чата
export function saveCurrentChatId(chatId) {
    if (chatId) {
        sessionStorage.setItem(SESSION_KEYS.CURRENT_CHAT_ID, chatId.toString());
    } else {
        sessionStorage.removeItem(SESSION_KEYS.CURRENT_CHAT_ID);
    }
}

// Сохраняем ID текущей комнаты
export function saveCurrentRoomId(roomId) {
    if (roomId) {
        sessionStorage.setItem(SESSION_KEYS.CURRENT_ROOM_ID, roomId.toString());
    } else {
        sessionStorage.removeItem(SESSION_KEYS.CURRENT_ROOM_ID);
    }
}

// Загружаем ID текущего чата
export function loadCurrentChatId() {
    const saved = sessionStorage.getItem(SESSION_KEYS.CURRENT_CHAT_ID);
    return saved ? parseInt(saved) : null;
}

// Загружаем ID текущей комнаты
export function loadCurrentRoomId() {
    const saved = sessionStorage.getItem(SESSION_KEYS.CURRENT_ROOM_ID);
    return saved ? parseInt(saved) : null;
}

// Очищаем все сохраненные данные
export function clearSessionData() {
    sessionStorage.removeItem(SESSION_KEYS.CURRENT_CHAT_ID);
    sessionStorage.removeItem(SESSION_KEYS.CURRENT_ROOM_ID);
}