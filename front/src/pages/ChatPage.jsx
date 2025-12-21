import './styles/ChatPage.css'
import LayoutWithNav from '../components/LayoutWithNav';
import SendIcon from "../assets/icons/send.svg"
import { useEffect, useState } from 'react';
import ChatCard from '../components/ChatCard';
import { useSearchParams } from 'react-router-dom';

function ChatPage() {
    const [currentChat, setCurrentChat] = useState(null);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [isMute, setMute] = useState(false)
    const [messageData, setMessageData] = useState({
        message: '',
        time: ''
    });

    const [searchParams] = useSearchParams(); // Получаем параметры из URL
    const chatIdFromUrl = searchParams.get('chatId'); // Получаем chatId из параметра

    const chats = [
        {
            id: 1,
            name: 'Чат 1',
            avatar: "../../public/vite.svg",
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
                            id: 1,
                            name: "GamerPro",
                            avatar: "../../public/vite.svg"
                        },
                        {
                            id: 2,
                            name: "Capa",
                            avatar: "../../public/vite.svg"
                        }
                    ]
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

    // Эффект для автоматического выбора чата при загрузке страницы
    useEffect(() => {
        if (chatIdFromUrl) {
            const chatId = parseInt(chatIdFromUrl);
            const chat = chats.find(chat => chat.id === chatId);
            if (chat) {
                setCurrentChat(chat);
            }
        }
    }, [chatIdFromUrl]); // Зависимость от chatIdFromUrl

    function updateCurrentChat(chatId) {
        const chat = chats.find(chat => chat.id === chatId);
        setCurrentChat(chat);

        // Обновляем URL без перезагрузки страницы
        window.history.pushState({}, '', `/chats?chatId=${chatId}`);
    }


    function joinToRoom(roomId) {
        const room = currentChat.rooms.find(room => room.id === roomId);

        setCurrentRoom(
            {
                ...room,
                chatId: currentChat.id
            });
    }

    function leaveRoom() {
        setCurrentRoom(null);
    }


    function handleMuteButton() {
        setMute(!isMute);
        //TODO: muting and unmuting of micro
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setMessageData(prev => ({
            ...prev,
            [name]: value
        }));

        // Автоматическое изменение высоты textarea
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
    }

    function sendMessage(e) {
        e.preventDefault(); // Не перезагружать страницу
        try {
            //TODO: sending message

            setMessageData({
                message: '',
                time: ''
            });
        } catch (error) {
            console.error('Ошибка входа:', error);
        }
    }

    function handleKeyDown(e) {
        // Проверяем, что нажата клавиша Enter
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Предотвращаем перенос строки
            sendMessage(e); // Отправляем сообщение
        }
        // Если Shift + Enter - оставляем перенос строки
    }

    return (
        <LayoutWithNav>
            <div className='chat-page__container'>
                <div className='chat-page__chats'>
                    {chats.map((chat) => (
                        <ChatCard
                            key={chat.id}
                            chat={chat}
                            onClick={() => updateCurrentChat(chat.id)}
                            className={currentChat?.id === chat.id ? 'chat-page__chat--active' : ''}
                        />
                    ))}
                </div>
                <div className='chat-page__main'>
                    {currentChat ? (
                        <div className='chat-page__current-chat-container'>
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
                            <form className='chat-page__input-message' onSubmit={sendMessage}>
                                <textarea
                                    className='chat-page__input'
                                    placeholder='Сообщение...'
                                    name="message"
                                    value={messageData.message}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    rows={1}
                                />
                                <button type="submit">
                                    <img src={SendIcon} />
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className='chat-page__no-chat-selected'>
                            Выберите чат для начала общения
                        </div>
                    )}
                </div>
                <div className='chat-page__rooms-container'>
                    {currentRoom ? (
                        <div className='chat-page__active-room-info'>
                            <div className='chat-page__room chat-page__room--active'>
                                <div>
                                    {currentRoom.name}
                                </div>
                                <div>
                                    ({chats.find(chat => chat.id === currentRoom.chatId).name})
                                </div>
                            </div>

                            <div className='chat-page__room-players-list-header'>
                                УЧАСТНИКИ – {currentRoom.players.length}:
                            </div>
                            <div className='chat-page__room-players-list'>
                                {currentRoom.players.map((player) => (
                                    <div key={player.id} className='chat-page__room-player'>
                                        <img className='chat-page__room-player-avatar' src={player.avatar} />
                                        <span className='chat-page__room-player-name'>
                                            {player.name}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className='chat-page__room-buttons'>
                                <button className='chat-page__room-button' onClick={handleMuteButton}>{isMute ? 'Включить' : 'Заглушить'}</button>
                                <button className='chat-page__room-button chat-page__room-leave-button' onClick={leaveRoom}>Выйти</button>
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
                                                {room.players.length} / {room.limit}
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
        </LayoutWithNav >
    );
}

export default ChatPage;