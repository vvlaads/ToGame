import React, { createContext, useState, useContext, useCallback } from 'react';

// Начальные данные чатов
const initialChats = [
    {
        id: 1,
        name: 'Чат 1',
        avatar: "../../public/vite.svg",
        rooms: [],
        messages: [
            {
                name: "vvlaads",
                date: "20.12.2025",
                time: "12:12:15",
                message: "Привет!"
            },
            {
                name: "vvlaads",
                date: "21.12.2025",
                time: "12:12:30",
                message: "Привет!"
            }
        ]
    },
    {
        id: 2,
        name: 'Чат 2',
        avatar: "../../public/vite.svg",
        rooms: [
            {
                id: 1,
                name: "Болталка",
                limit: 15,
                players: [
                    {
                        name: "vvlaads",
                        avatar: "../../public/vite.svg"
                    },
                    {
                        name: "vvlaads",
                        avatar: "../../public/vite.svg"
                    },
                    {
                        name: "vvlaads",
                        avatar: "../../public/vite.svg"
                    },
                    {
                        name: "vvlaads",
                        avatar: "../../public/vite.svg"
                    }
                ]
            },
            {
                id: 2,
                name: "CS:GO",
                limit: 15,
                players: [
                    {
                        name: "GamerPro",
                        avatar: "../../public/vite.svg"
                    },
                    {
                        name: "Capa",
                        avatar: "../../public/vite.svg"
                    }
                ]
            }
        ],
        messages: [
            {
                name: "GamerPro",
                date: "19.11.2025",
                time: "12:10:00",
                message: "Привет!"
            }
        ]
    }
];

const ChatsContext = createContext();

export function ChatsProvider({ children }) {
    const [chats, setChats] = useState(initialChats);

    // Функция для добавления нового сообщения в чат
    function addMessage(chatId, message) {
        setChats(prevChats =>
            prevChats.map(chat => {
                if (chat.id === chatId) {
                    const newMessage = {
                        name: message.name || 'Аноним',
                        message: message.message || '',
                        date: message.date || new Date().toLocaleDateString('ru-RU'),
                        time: message.time || new Date().toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        })
                    };

                    return {
                        ...chat,
                        messages: [...chat.messages, newMessage]
                    };
                }
                return chat;
            })
        );
    }

    // Функция для добавления нового чата
    function addChat(newChat) {
        const newChatWithDefaults = {
            ...newChat,
            id: newChat.id || Date.now(),
            messages: newChat.messages || [],
            rooms: newChat.rooms || []
        };

        setChats(prevChats => [...prevChats, newChatWithDefaults]);
        return newChatWithDefaults.id;
    }

    // Функция для обновления чата
    function updateChat(chatId, updatedData) {
        setChats(prevChats =>
            prevChats.map(chat =>
                chat.id === chatId ? { ...chat, ...updatedData } : chat
            )
        );
    }

    // Функция для получения чата по ID
    function getChatById(chatId) {
        return chats.find(chat => chat.id === chatId);
    }

    // Функция для удаления чата
    function removeChat(chatId) {
        setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
    }

    // Функция для очистки сообщений в чате
    function clearChatMessages(chatId) {
        setChats(prevChats =>
            prevChats.map(chat =>
                chat.id === chatId ? { ...chat, messages: [] } : chat
            )
        );
    }

    // Функция для добавления комнаты в чат
    function addRoom(chatId, roomData) {
        setChats(prevChats =>
            prevChats.map(chat => {
                if (chat.id === chatId) {
                    // Проверяем лимит комнат
                    if (chat.rooms.length >= 5) {
                        console.warn('Достигнут лимит комнат (максимум 5)');
                        return chat;
                    }

                    const newRoom = {
                        id: Date.now(), // Уникальный ID
                        name: roomData.name || 'Новая комната',
                        limit: roomData.limit || 15,
                        players: roomData.players || []
                    };

                    return {
                        ...chat,
                        rooms: [...chat.rooms, newRoom]
                    };
                }
                return chat;
            })
        );
    }

    // Функция для добавления игрока в комнату
    function addPlayerToRoom(chatId, roomId, player) {
        setChats(prevChats =>
            prevChats.map(chat => {
                if (chat.id === chatId) {
                    const roomIndex = chat.rooms.findIndex(room => room.id === roomId);

                    if (roomIndex === -1) {
                        return chat;
                    }

                    const room = chat.rooms[roomIndex];

                    // Проверяем лимит игроков
                    if (room.players.length >= room.limit) {
                        console.warn('Комната заполнена');
                        return chat;
                    }

                    // Проверяем, есть ли уже такой игрок
                    const playerExists = room.players.some(p => p.name === player.name);
                    if (playerExists) {
                        console.warn('Игрок уже в комнате');
                        return chat;
                    }

                    const updatedRooms = [...chat.rooms];
                    updatedRooms[roomIndex] = {
                        ...room,
                        players: [...room.players, {
                            name: player.name || 'Игрок',
                            avatar: player.avatar || "../../public/vite.svg"
                        }]
                    };

                    return {
                        ...chat,
                        rooms: updatedRooms
                    };
                }
                return chat;
            })
        );
    }

    // Функция для удаления игрока из комнаты
    function removePlayerFromRoom(chatId, roomId, playerName) {
        setChats(prevChats =>
            prevChats.map(chat => {
                if (chat.id === chatId) {
                    const roomIndex = chat.rooms.findIndex(room => room.id === roomId);

                    if (roomIndex === -1) {
                        return chat;
                    }

                    const room = chat.rooms[roomIndex];
                    const updatedRooms = [...chat.rooms];

                    updatedRooms[roomIndex] = {
                        ...room,
                        players: room.players.filter(player => player.name !== playerName)
                    };

                    return {
                        ...chat,
                        rooms: updatedRooms
                    };
                }
                return chat;
            })
        );
    }

    // Функция для удаления комнаты
    function removeRoom(chatId, roomId) {
        setChats(prevChats =>
            prevChats.map(chat => {
                if (chat.id === chatId) {
                    return {
                        ...chat,
                        rooms: chat.rooms.filter(room => room.id !== roomId)
                    };
                }
                return chat;
            })
        );
    }

    const value = {
        chats,
        addMessage,
        addChat,
        updateChat,
        getChatById,
        removeChat,
        clearChatMessages,
        addRoom,
        addPlayerToRoom,
        removePlayerFromRoom,
        removeRoom
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