import './styles/ChatPage.css'
import LayoutWithNav from '../components/LayoutWithNav';
import SendIcon from "../assets/icons/send.svg"
import ChatCard from '../components/ChatCard';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useChats } from '../context/ChatsContext';
import { useAuth } from '../context/AuthContext';
import { formatMessageDateTime } from '../utils/chatUtils';
import { loadCurrentChat, loadCurrentRoom, saveCurrentChat, saveCurrentRoom } from '../utils/sessionStorage';
import TrashIcon from '../assets/icons/trash.svg';
import Modal from '../components/Modal';

function ChatPage() {
    const { user } = useAuth();
    const [currentChat, setCurrentChat] = useState(null);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [isMute, setMute] = useState(false);
    const [searchParams] = useSearchParams();
    const chatIdFromUrl = searchParams.get('chatId');
    const { chats, addMessage, addRoom, removeRoom, addPlayerToRoom, removePlayerFromRoom } = useChats();
    const [messageData, setMessageData] = useState({
        message: '',
        time: ''
    });
    const [newRoom, setNewRoom] = useState({
        id: 0,
        name: '',
        limit: null,
        players: []
    });
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setNewRoom({
            id: 0,
            name: '',
            limit: null,
            players: []
        });
    };

    // Вспомогательная функция для поиска комнаты по ID
    function findRoomById(roomId) {
        for (const chat of chats) {
            if (chat.rooms && chat.rooms.length > 0) {
                const room = chat.rooms.find(r => r.id === roomId);
                if (room) {
                    return { room, chat };
                }
            }
        }
        return { room: null, chat: null };
    }

    useEffect(() => {
        const savedRoomId = loadCurrentRoom();
        if (savedRoomId) {
            const { room, chat } = findRoomById(savedRoomId);

            if (room && chat) {
                setCurrentRoom({
                    ...room,
                    chatId: chat.id
                });
            }
        }

        if (chatIdFromUrl) {
            const chatId = parseInt(chatIdFromUrl);
            const chat = chats.find(c => c.id === chatId);
            if (chat) {
                setCurrentChat(chat);
                saveCurrentChat(chatId);
            }
        } else {
            const savedChatId = loadCurrentChat();
            if (savedChatId) {
                const chat = chats.find(c => c.id === savedChatId);
                if (chat) setCurrentChat(chat);
            }
        }
    }, [chatIdFromUrl, chats]);

    // Обновить текущий чат
    function updateCurrentChat(chatId) {
        const chat = chats.find(chat => chat.id === chatId);
        setCurrentChat(chat);
        saveCurrentChat(chatId);
        window.history.pushState({}, '', `/chats?chatId=${chatId}`);
    }

    function addNewRoom(e) {
        e.preventDefault(); // Не перезагружать страницу
        try {
            addRoom(currentChat.id, newRoom);
            closeModal();
        } catch (error) {
            console.error('Ошибка входа:', error);
        }
    }

    // Обновляем сохраненные данные
    function changeRoomForm(e) {
        const { name, value } = e.target;
        setNewRoom(prev => ({
            ...prev,
            [name]: value
        }));
    }

    function joinToRoom(roomId) {
        const { room, chat } = findRoomById(roomId);

        if (!room || !chat) return;

        addPlayerToRoom(
            currentChat.id,
            roomId,
            {
                id: user.id,
                name: user.username,
                avatar: "../../public/vite.svg"
            }
        );

        setCurrentRoom({
            ...room,
            chatId: chat.id
        });

        // Автоматически переключаемся на чат комнаты
        setCurrentChat(chat);

        // Сохраняем оба состояния
        saveCurrentRoom(roomId);
        saveCurrentChat(chat.id);

        // Обновляем URL
        window.history.pushState({}, '', `/chats?chatId=${chat.id}`);
    }

    function leaveRoom() {
        removePlayerFromRoom(currentRoom.chatId, currentRoom.id, user.username);
        setCurrentRoom(null);
        saveCurrentRoom(null);
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

    /**
     * Отправка сообщения в чат
     */
    function sendMessage(e) {
        e.preventDefault();

        if (messageData.message.trim() === '') return;

        try {
            // Создаем новое сообщение
            const newMessage = {
                name: user?.username,
                message: messageData.message,
                date: new Date().toLocaleDateString('ru-RU'),
                time: new Date().toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }),
            };

            // Добавляем сообщение в глобальный список чатов
            if (currentChat) {
                addMessage(currentChat.id, newMessage);
            }

            // Очищаем поле ввода
            setMessageData({
                message: '',
                time: ''
            });

        } catch (error) {
            console.error('Ошибка отправки:', error);
        }
    }

    /**
     * Отправка сообщения при нажатии Enter
     */
    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(e);
        }
    }

    return (
        <LayoutWithNav>
            <div className='chat-page__container'>
                {/*Вкладка чатов*/}
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



                {/*Вкладка текущего чата*/}
                <div className='chat-page__main'>
                    {currentChat ? (
                        <div className='chat-page__current-chat-container'>
                            <div className='chat-page__messages'>
                                {currentChat.messages.map((message, index) => (
                                    <div key={index} className='chat-page__chat-message'>
                                        <div className='chat-page__message-content'>
                                            <strong>{message.name}</strong>: {message.message}
                                        </div>
                                        <div className='chat-page__message-date'>{formatMessageDateTime(message)}</div>
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



                {/*Вкладка комнат*/}
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
                                {currentRoom.players.length > 0 ? (
                                    currentRoom.players.map((player) => (
                                        <div key={player.id} className='chat-page__room-player'>
                                            <img className='chat-page__room-player-avatar' src={player.avatar} />
                                            <span className='chat-page__room-player-name'>
                                                {player.name}
                                            </span>
                                        </div>
                                    ))
                                ) : (<>Тут никого нет</>)}

                            </div>

                            <div className='chat-page__room-buttons'>
                                <button className='chat-page__room-button' onClick={handleMuteButton}>{isMute ? 'Включить' : 'Заглушить'}</button>
                                <button className='chat-page__room-button chat-page__room-leave-button' onClick={leaveRoom}>Выйти</button>
                            </div>
                        </div>) :
                        (
                            <div className='chat-page__rooms'>
                                {currentChat && currentChat.rooms.length > 0 ? (
                                    currentChat.rooms.map((room, index) => (
                                        <div key={index} className='chat-page__room'>
                                            <div
                                                className='chat-page__room-info'
                                                onClick={() => joinToRoom(room.id)}
                                            >
                                                <div>{room.name}</div>
                                                <div>
                                                    {room.players.length} / {room.limit}
                                                </div>
                                            </div>

                                            <button
                                                className='chat-page__delete-room'
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeRoom(currentChat.id, room.id);
                                                }}
                                                title="Удалить комнату"
                                            >
                                                <img className='chat-page__delete-room-icon' src={TrashIcon} alt="Удалить" />
                                            </button>
                                        </div>
                                    ))
                                ) : (<></>)}
                                <button className='chat-page__add-room' onClick={openModal}>
                                    Добавить комнату
                                </button>
                                <Modal isOpen={modalIsOpen} onClose={closeModal}>
                                    <div className='chat-page__add-room-window'>
                                        <h1 className='chat-page__add-room-window-header'>Добавить комнату</h1>
                                        <form className='chat-page__add-room-window-form' onSubmit={addNewRoom}>
                                            <input
                                                type='text'
                                                name='name'
                                                placeholder='Введите название комнаты'
                                                className='chat-page__add-room-window-input'
                                                value={newRoom.name}
                                                onChange={changeRoomForm}
                                            />
                                            <input
                                                type='number'
                                                name='limit'
                                                placeholder='Введите лимит комнаты'
                                                className='chat-page__add-room-window-input'
                                                value={newRoom.limit}
                                                onChange={changeRoomForm}
                                            />
                                            <div className='chat-page__add-room-window-buttons'>
                                                <button
                                                    type='submit'
                                                    id='chat-page__add-room-window-submit-button'
                                                    className='chat-page__add-room-window-button'>
                                                    Добавить
                                                </button>
                                                <button
                                                    id='chat-page__add-room-window-cancel-button'
                                                    className='chat-page__add-room-window-button'
                                                    onClick={closeModal}>
                                                    Отмена
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </Modal>
                            </div>
                        )}


                </div>
            </div>
        </LayoutWithNav >
    );
}

export default ChatPage;