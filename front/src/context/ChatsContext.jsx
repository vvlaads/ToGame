import config from '../config/index.jsx'
import { createContext, useState, useContext } from 'react';
import { CHAT_LIST, MESSAGE_LIST, ROOM_LIST, USER_LIST } from '../constants/testValues';
import { API_ENDPOINTS } from '../constants/api.jsx';
import { useAuth } from './AuthContext.jsx';

const ChatsContext = createContext();

const API_BASE_URL = config.apiUrl;
const API_CHAT_URL = `${API_BASE_URL}${API_ENDPOINTS.CHAT}`;
const API_CREATE_CHAT_URL = `${API_BASE_URL}${API_ENDPOINTS.CREATE_CHAT}`;
const API_UPDATE_CHAT_URL = `${API_BASE_URL}${API_ENDPOINTS.UPDATE_CHAT}`;
const API_DELETE_CHAT_URL = `${API_BASE_URL}${API_ENDPOINTS.DELETE_CHAT}`;

export function ChatsProvider({ children }) {
    const { user, getUserInfo } = useAuth();
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
    async function addMessage(messageData) {
        // Тестовые данные для дебага
        if (config.debug) {
            let messages = MESSAGE_LIST.filter(message => message.chatId === messageData.chatId);
            messages.push({ ...messageData, uuid: Date.now() });
            return { success: true, data: messages };
        }

        //TODO: обращение к серверу
        return { success: false, error: 'Не удалось добавить сообщение' };
    }

    // Функция для добавления комнаты в чат
    async function createRoom(roomData) {
        // Тестовые данные для дебага
        if (config.debug) {
            let rooms = ROOM_LIST.filter(room => room.chatId === roomData.chatId);
            rooms.push({ ...roomData, uuid: Date.now() });
            return { success: true, data: rooms };
        }

        //TODO: обращение к серверу
        return { success: false, error: 'Не удалось добавить комнату' };
    }

    async function getRoomPlayers(roomId) {
        //Тестовые данные для дебага
        if (config.debug) {
            const players = [];
            USER_LIST.forEach(user => {
                if (user.roomId === roomId) {
                    players.push(user);
                }
            })
            return { success: true, data: players };
        }

        //TODO: обращение к серверу
        return { success: false, error: 'Ошибка получения игроков' };
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

    async function getRooms(chatId) {
        //Тестовые данные для дебага
        if (config.debug) {
            const rooms = [];
            ROOM_LIST.forEach(room => {
                if (room.chatId === chatId) {
                    rooms.push(room);
                }
            })
            return { success: true, data: rooms };
        }

        //TODO: обращение к серверу
        return { success: false, error: 'Ошибка получения комнат' };
    }

    async function getMessages(chatId) {
        //Тестовые данные для дебага
        if (config.debug) {
            const messages = [];
            MESSAGE_LIST.forEach(message => {
                if (message.chatId === chatId) {
                    messages.push(message);
                }
            })
            return { success: true, data: messages };
        }

        //TODO: обращение к серверу
        return { success: false, error: 'Ошибка получения сообщений' };
    }

    // Получаем последнее сообщение из массива сообщений
    async function getLastMessage(chatId) {
        const messagesResponse = await getMessages(chatId);
        if (!messagesResponse.success) {
            return null;
        }
        const messages = messagesResponse.data;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return null;
        }

        return messages.reduce((latest, current) => {
            if (!latest) return current;
            return current.createdAt > latest.createdAt ? current : latest;
        }, null);
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
        deleteRoom,
        getMessages,
        getLastMessage,
        getRooms,
        getRoomPlayers
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