import config from '../config/index.jsx'
import { createContext, useState, useContext } from 'react';
import { CHAT_LIST } from '../constants/testValues';
import { API_ENDPOINTS } from '../constants/api.jsx';
import { useAuth } from './AuthContext.jsx';

const ChatsContext = createContext();

const API_BASE_URL = config.apiUrl;
const API_CHAT_URL = `${API_BASE_URL}${API_ENDPOINTS.CHAT}`;
const API_CREATE_CHAT_URL = `${API_BASE_URL}${API_ENDPOINTS.CREATE_CHAT}`;
const API_UPDATE_CHAT_URL = `${API_BASE_URL}${API_ENDPOINTS.UPDATE_CHAT}`;
const API_DELETE_CHAT_URL = `${API_BASE_URL}${API_ENDPOINTS.DELETE_CHAT}`;

export function ChatsProvider({ children }) {
    const { user } = useAuth();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(false);

    // Получение чата по ID
    function getChatById(chatId) {
        return chats.find(chat => chat.id === chatId);
    }

    // Получение комнаты по ID
    function getRoomById(roomId) {
        for (const chat in chats) {
            if (chat.rooms && chat.rooms.length > 0) {
                const room = chat.rooms.find(room => room.id === roomId);
                if (room) {
                    return room;
                }
            }
        }
        return null;
    }

    // Получить список чатов для пользователя
    async function getChatList() {
        setLoading(true);

        // Для дебага имитируем обращение к серверу
        if (config.debug) {
            const chatsData = CHAT_LIST;
            setChats(chatsData);
            setLoading(false);
            return { success: true, data: chatsData };
        }

        // Основное тело метода
        try {
            const response = await fetch(API_CHAT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user: user })
            });

            if (!response.ok) {
                throw new Error('Ошибка получения чатов');
            }

            const chatsData = await response.json();
            setChats(chatsData);
            setLoading(false);
            return { success: true, data: chatsData };

        } catch (error) {
            console.error('Ошибка получения чатов', error);
            setLoading(false);
            return { success: false, error: error.message };
        }
    }

    // Создание нового чата
    async function createChat(chatData) {
        // Для дебага имитируем обращение к серверу
        if (config.debug) {
            setChats(prevChats =>
                [...prevChats, { id: Date.now(), ...chatData }]
            );
            return { success: true, data: chats };
        }

        // Основное тело метода
        try {
            const response = await fetch(API_CREATE_CHAT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chatData })
            });

            if (!response.ok) {
                throw new Error('Ошибка создания чата');
            }

            const chatsData = await response.json();
            setChats(chatsData);
            return { success: true, data: chatsData };

        } catch (error) {
            console.error('Ошибка создания чата', error);
            return { success: false, error: error.message };
        }
    }

    // Обновление чата
    async function updateChat(chatId, updatedData) {
        // Для дебага имитируем обращение к серверу
        if (config.debug) {
            let updatedChats;

            setChats(prevChats => {
                updatedChats = prevChats.map(chat => {
                    if (chat.id === chatId) {
                        return {
                            ...chat,
                            ...updatedData
                        };
                    }
                    return chat;
                });
                return updatedChats;
            });

            return { success: true, data: updatedChats };
        }


        // Основное тело метода
        try {
            const response = await fetch(`${API_UPDATE_CHAT_URL}/${chatId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ updatedData })
            });

            if (!response.ok) {
                throw new Error('Ошибка ообновления чата');
            }

            const chatsData = await response.json();
            setChats(chatsData);
            return { success: true, data: chatsData };

        } catch (error) {
            console.error('Ошибка ообновления чата', error);
            return { success: false, error: error.message };
        }
    }

    // Удаление чата
    async function deleteChat(chatId) {
        // Для дебага имитируем обращение к серверу
        if (config.debug) {
            setChats(prevChats =>
                prevChats.filter(chat => chat.id !== chatId)
            );
            return { success: true, data: chats };
        }

        // Основное тело метода
        try {
            const response = await fetch(`${API_DELETE_CHAT_URL}/${chatId}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Ошибка удаления чата');
            }

            const chatsData = await response.json();
            setChats(chatsData);
            return { success: true, data: chatsData };

        } catch (error) {
            console.error('Ошибка удаления чата', error);
            return { success: false, error: error.message };
        }
    }

    // Добавить новое сообщения в чат
    async function addMessage(chatId, message) {
        const chat = getChatById(chatId);
        if (!chat) {
            console.error('Чат не найден');
            return { success: false, error: 'Чат не найден' };
        }

        chat.messages.push(message);
        const updatedData = {
            messages: chat.messages
        };
        return await updateChat(chatId, updatedData);
    }

    // Функция для добавления комнаты в чат
    async function createRoom(chatId, roomData) {
        const chat = getChatById(chatId);
        if (!chat) {
            console.error('Чат не найден');
            return { success: false, error: 'Чат не найден' };
        }
        chat.rooms.push(roomData);
        const updatedData = {
            rooms: chat.rooms
        };
        return await updateChat(chatId, updatedData);
    }

    // Функция для добавления игрока в комнату
    async function addPlayerToRoom(chatId, roomId, player) {
        const chat = getChatById(chatId);
        if (!chat) {
            console.error('Чат не найден');
            return { success: false, error: 'Чат не найден' };
        }

        const newRooms = []
        chat.rooms.map(room => {
            if (room.id === roomId) {
                newRooms.push(getRoomById(chatId, roomId).players.push(player));
            }
            newRooms.push(room)
        })

        const updatedData = {
            rooms: newRooms
        };
        return await updateChat(chatId, updatedData);
    }

    // Функция для удаления игрока из комнаты
    async function removePlayerFromRoom(chatId, roomId, playerName) {
        const chat = getChatById(chatId);
        if (!chat) {
            console.error('Чат не найден');
            return { success: false, error: 'Чат не найден' };
        }
        const newRooms = []
        chat.rooms.map(room => {
            if (room.id === roomId) {
                const players = getRoomById(chatId, roomId).players;
                const playerList = [];
                players.map(player => {
                    if (player.name !== playerName) {
                        playerList.push(player);
                    }
                })
                const currentRoom = getRoomById(chatId, roomId);
                currentRoom.players = playerList;
                newRooms.push(currentRoom);
            }
            newRooms.push(room)
        })

        const updatedData = {
            rooms: newRooms
        };
        return await updateChat(chatId, updatedData);
    }

    // Функция для удаления комнаты
    async function deleteRoom(roomId) {
        for (const chat in chats) {
            if (chat.rooms && chat.rooms.length > 0) {
                const room = chat.rooms.find(room => room.id === roomId);
                if (room) {
                    const updatedData = {
                        rooms: chat.rooms.filter(room => room.id === roomId)
                    };
                    return await updateChat(chat.id, updatedData);
                }
            }
        }
    }

    const value = {
        chats,
        loading,
        getChatList,
        addMessage,
        createChat,
        updateChat,
        getChatById,
        getRoomById,
        deleteChat,
        createRoom,
        addPlayerToRoom,
        removePlayerFromRoom,
        deleteRoom
    };

    return (
        <ChatsContext.Provider value={value}>
            {children}
        </ChatsContext.Provider>
    );
}

// Хук для использования контекста чатов
export function useChats() {
    const context = useContext(ChatsContext);
    if (!context) {
        throw new Error('useChats must be used within a ChatsProvider');
    }
    return context;
}