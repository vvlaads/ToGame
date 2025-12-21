const SESSION_KEYS = {
    CURRENT_CHAT: 'current_chat_id',
    CURRENT_ROOM: 'current_room_id'
};

// Сохраняем текущий чат
export function saveCurrentChat(chatId) {
    if (chatId) {
        sessionStorage.setItem(SESSION_KEYS.CURRENT_CHAT, chatId.toString());
    } else {
        sessionStorage.removeItem(SESSION_KEYS.CURRENT_CHAT);
    }
}

// Сохраняем текущую комнату
export function saveCurrentRoom(roomId) {
    if (roomId) {
        sessionStorage.setItem(SESSION_KEYS.CURRENT_ROOM, roomId.toString());
    } else {
        sessionStorage.removeItem(SESSION_KEYS.CURRENT_ROOM);
    }
}

// Загружаем сохраненный чат
export function loadCurrentChat() {
    const saved = sessionStorage.getItem(SESSION_KEYS.CURRENT_CHAT);
    return saved ? parseInt(saved) : null;
}

// Загружаем сохраненную комнату
export function loadCurrentRoom() {
    const saved = sessionStorage.getItem(SESSION_KEYS.CURRENT_ROOM);
    return saved ? parseInt(saved) : null;
}

// Очищаем все сохраненные данные
export function clearSessionData() {
    sessionStorage.removeItem(SESSION_KEYS.CURRENT_CHAT);
    sessionStorage.removeItem(SESSION_KEYS.CURRENT_ROOM);
}