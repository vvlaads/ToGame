import React, { createContext, useState, useContext } from 'react';

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
    const addMessage = (chatId, message) => {
        setChats(prevChats =>
            prevChats.map(chat => {
                if (chat.id === chatId) {
                    return {
                        ...chat,
                        messages: [...chat.messages, {
                            ...message,
                            // Гарантируем наличие всех полей
                            name: message.name || 'Аноним',
                            message: message.message || '',
                            date: message.date || new Date().toLocaleDateString('ru-RU'),
                            time: message.time || new Date().toLocaleTimeString('ru-RU')
                        }]
                    };
                }
                return chat;
            })
        );
    };

    // Функция для добавления нового чата
    const addChat = (newChat) => {
        setChats(prevChats => [...prevChats, {
            ...newChat,
            id: Date.now(), // Генерируем уникальный ID если не указан
            messages: newChat.messages || [],
            rooms: newChat.rooms || []
        }]);
    };

    // Функция для обновления чата
    const updateChat = (chatId, updatedData) => {
        setChats(prevChats =>
            prevChats.map(chat =>
                chat.id === chatId ? { ...chat, ...updatedData } : chat
            )
        );
    };

    // Функция для получения чата по ID
    const getChatById = (chatId) => {
        return chats.find(chat => chat.id === chatId);
    };

    // Функция для удаления чата
    const removeChat = (chatId) => {
        setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
    };

    // Функция для очистки сообщений в чате
    const clearChatMessages = (chatId) => {
        setChats(prevChats =>
            prevChats.map(chat =>
                chat.id === chatId ? { ...chat, messages: [] } : chat
            )
        );
    };

    const value = {
        chats,
        setChats,
        addMessage,
        addChat,
        updateChat,
        getChatById,
        removeChat,
        clearChatMessages
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