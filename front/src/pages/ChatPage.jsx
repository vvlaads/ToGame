import './styles/ChatPage.css'
import LayoutWithNav from '../components/LayoutWithNav';
import ChatIcon from '../../public/vite.svg';
import { useState } from 'react';

function ChatPage() {
    const [currentChat, setCurrentChat] = useState(null);
    const chats = [
        {
            id: 1,
            name: 'Чат 1',
            lastUsername: 'vvlaads',
            lastMessage: 'Всем привет!',
            rooms: [],
            messages: [
                {
                    name: "vvlaads",
                    date: "20.12.2025",
                    time: "12:12",
                    message: "Привет!"
                },
                {
                    name: "vvlaads",
                    date: "20.12.2025",
                    time: "12:12",
                    message: "Привет!"
                },
                {
                    name: "vvlaads",
                    date: "20.12.2025",
                    time: "12:12",
                    message: "Всем привет!"
                }
            ]
        },
        {
            id: 2,
            name: 'Чат 2',
            lastUsername: 'GamerPro',
            lastMessage: 'Го кс?',
            rooms: [
                {
                    id: 1,
                    name: "Болталка",
                    limit: 15,
                    players: 1
                }
            ],
            messages: [
                {
                    name: "GamerPro",
                    date: "20.12.2025",
                    time: "12:10",
                    message: "Привет!"
                },
                {
                    name: "vvlaads",
                    date: "20.12.2025",
                    time: "12:12",
                    message: "Привет!"
                },
                {
                    name: "GamerPro",
                    date: "20.12.2025",
                    time: "12:15",
                    message: "Го кс?"
                }
            ]
        },
        // ... остальные чаты
    ];

    function updateCurrentChat(chatId) {
        // Используем поиск по id, а не индексу массива
        const chat = chats.find(chat => chat.id === chatId);
        setCurrentChat(chat);
    }

    const [currentRoom, setCurrentRoom] = useState(null);

    function joinToRoom(roomId) {
        const room = currentChat.rooms.find(room => room.id === roomId);
        setCurrentRoom(room);
    }

    function leaveRoom() {
        setCurrentRoom(null);
    }

    return (
        <LayoutWithNav>
            <div className='chat-page__container'>
                <div className='chat-page__chats'>
                    {chats.map((chat) => (
                        <div
                            key={chat.id} // Добавляем key
                            className='chat-page__chat'
                            onClick={() => updateCurrentChat(chat.id)} // Передаем id, а не индекс
                        >
                            <img className='chat-page__chat-avatar' src={ChatIcon} alt="Аватар чата" />
                            <div className='chat-page__chat-info'>
                                <div className='chat-page__chat-name'>{chat.name}</div>
                                <div className='chat-page__chat-last-message'>{chat.lastUsername}: {chat.lastMessage}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='chat-page__main'>
                    {currentChat ? (
                        <>
                            <div className='chat-page__messages'>
                                {currentChat.messages.map((message, index) => (
                                    <div key={index} className='chat-page__chat-message'>
                                        <div className='chat-page__message-content'>
                                            <strong>{message.name}</strong>: {message.message}
                                        </div>
                                        <div className='chat-page__message-date'>{message.time}</div>
                                    </div>
                                ))}
                            </div>
                            <div className='chat-page__input-message'>
                                <input className='chat-page__input' type='text' placeholder='Сообщение...' />
                            </div>
                        </>
                    ) : (
                        <div className='chat-page__no-chat-selected'>
                            Выберите чат для начала общения
                        </div>
                    )}
                </div>
                <div className='chat-page__rooms-container'>
                    {currentRoom ? (
                        <div>
                            <div className='chat-page__room--active'>
                                <div>
                                    {currentRoom.name}
                                </div>
                                <div>
                                    {currentRoom.players} / {currentRoom.limit}
                                </div>
                            </div>
                            <div className='chat-page__room'>
                                <button>Заглушить</button>
                                <button onClick={leaveRoom()}>Выйти</button>
                            </div>
                        </div>) : (
                        <>
                            {currentChat && currentChat.rooms.length > 0 ? (
                                <div className='chat-page__rooms'>
                                    {currentChat.rooms.map((room, index) => (
                                        <div key={index} className='chat-page__room' onClick={() => joinToRoom(room.id)}>
                                            <div>
                                                {room.name}
                                            </div>
                                            <div>
                                                {room.players} / {room.limit}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className='chat-page__no_rooms'>Тут будут голосовые чаты</div>
                            )}
                        </>)}


                </div>
            </div>
        </LayoutWithNav>
    );
}

export default ChatPage;