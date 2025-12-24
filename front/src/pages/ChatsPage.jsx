import './styles/ChatsPage.css'
import LayoutWithNav from '../components/LayoutWithNav';
import SendIcon from "../assets/icons/send.svg"
import ChatCard from '../components/ChatCard';
import TrashIcon from '../assets/icons/trash.svg';
import Modal from '../components/Modal';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useChats } from '../context/ChatsContext';
import { useAuth } from '../context/AuthContext';
import { formatMessageDateTime } from '../utils/chatUtils';
import { loadCurrentChatId, loadCurrentRoomId, saveCurrentChatId, saveCurrentRoomId } from '../utils/sessionStorage';

function ChatsPage() {
    const { user } = useAuth();
    const {
        chats,
        loading,
        getChatList,
        addMessage,
        createRoom,
        deleteRoom,
        getChatById,
        getRoomById,
        addPlayerToRoom,
        removePlayerFromRoom
    } = useChats();

    const [messageData, setMessageData] = useState({
        username: '',
        date: '',
        time: '',
        text: ''
    });

    const [roomData, setRoomData] = useState({
        id: 0,
        name: '',
        limit: 0,
        chatId: 0,
        players: []
    });

    const [currentChat, setCurrentChat] = useState(null);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isMute, setMute] = useState(false);

    const [searchParams] = useSearchParams();
    const chatIdFromUrl = searchParams.get('chatId');

    // Открыть модальное окно
    function openModal() {
        setModalIsOpen(true);
    };

    // Закрыть модальное окно
    function closeModal() {
        setModalIsOpen(false);
        setRoomData({
            id: 0,
            name: '',
            limit: 0,
            chatId: 0,
            players: []
        });
    };

    // Обновить текущий чат
    function updateCurrentChat(chatId) {
        setCurrentChat(getChatById(chatId));
        saveCurrentChatId(chatId);
        window.history.pushState({}, '', `/chats?chatId=${chatId}`);
    }

    // Обновить текущую комнату
    function updateCurrentRoom(roomId) {
        setCurrentRoom(getRoomById(roomId));
        saveCurrentRoomId(roomId);
    }

    // Создать новую комнату
    async function addRoom(e) {
        e.preventDefault(); // Не перезагружать страницу
        try {
            await createRoom(currentChat.id, { ...roomData, id: Math.round(Math.random() * 1000), chatId: currentChat.id });
            closeModal();
        } catch (error) {
            console.error('Ошибка создания комнаты:', error);
        }
    }
    // Удалить комнату
    async function removeRoom(e, room) {
        e.stopPropagation();
        try {
            await deleteRoom(room.id);
        } catch (error) {
            console.error('Ошибка удаления комнаты:', error);
        }
    }

    // Обновляем данные о новой комнате
    function changeRoomForm(e) {
        const { name, value } = e.target;
        setRoomData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    // Присоединиться к комнате
    function joinToRoom(roomId) {
        const room = getRoomById(roomId);

        if (!room) return;

        addPlayerToRoom(
            roomId,
            {
                id: user.id,
                name: user.username,
                avatar: "../../public/vite.svg"
            }
        );

        updateCurrentRoom(roomId);
    }

    // Выйти из комнаты
    function leaveRoom() {
        removePlayerFromRoom(currentRoom.chatId, currentRoom.id, user.username);
        updateCurrentRoom(null);
    }

    // Нажатие на кнопку Mute
    function handleMuteButton() {
        setMute(!isMute);
        //TODO: muting and unmuting of micro
    }

    // Обновляем данные о новом сообщении
    function changeMessageForm(e) {
        const { name, value } = e.target;
        setMessageData(prev => ({
            ...prev,
            [name]: value
        }));

        // Автоматическое изменение высоты textarea
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
    }

    // Отправка сообщения в чат
    async function sendMessage(e) {
        e.preventDefault();

        if (messageData.text.trim() === '') return;

        try {
            // Создаем новое сообщение
            const newMessage = {
                username: user?.username,
                text: messageData.text,
                date: new Date().toLocaleDateString('ru-RU'),
                time: new Date().toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }),
            };

            const result = await addMessage(currentChat.id, newMessage);

            if (!result.success) {
                console.error('Ошибка отправки:', result.error);
            }

            // Очищаем поле ввода
            setMessageData({
                username: '',
                date: '',
                time: '',
                text: ''
            });

        } catch (error) {
            console.error('Ошибка отправки:', error);
        }
    }

    // Отправка сообщения при нажатии Enter
    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(e);
        }
    }

    // Получаем чаты при загрузке компонента
    useEffect(() => {
        const fetchChats = async () => {
            if (user) {
                await getChatList();
            }
        };

        fetchChats();
    }, [user, getChatList]);

    // Восстановление последней комнаты и чата
    useEffect(() => {
        const savedRoomId = loadCurrentRoomId();
        if (savedRoomId) {
            const { room, chat } = getRoomById(savedRoomId);

            if (room && chat) {
                setCurrentRoom({
                    ...room,
                    chatId: chat.id
                });
            }
        }

        if (chatIdFromUrl) {
            const chatId = parseInt(chatIdFromUrl);
            setCurrentChat(getChatById(chatId));
            saveCurrentChatId(chatId);
        } else {
            const savedChatId = loadCurrentChatId();
            if (savedChatId) {
                setCurrentChat(getChatById(savedChatId));
            }
        }
    }, [chatIdFromUrl]);

    // Заглушка на время загрузки
    if (loading) {
        return (
            <LayoutWithNav>
                <div className="chat-page__loading">
                    Загрузка чатов...
                </div>
            </LayoutWithNav>
        );
    }

    return (
        <LayoutWithNav>
            <div className='chat-page__container'>
                {/*Вкладка чатов*/}
                <div className='chat-page__chats'>
                    {Array.isArray(chats) && chats.length > 0 ? (
                        chats.map((chat) => (
                            <ChatCard
                                key={chat.id}
                                chat={chat}
                                onClick={() => updateCurrentChat(chat.id)}
                                className={currentChat?.id === chat.id ? 'chat-page__chat--active' : ''}
                            />
                        ))
                    ) : (
                        <div className='chat-page__no-chats-message'>
                            Нет доступных чатов
                        </div>
                    )}
                </div>



                {/*Вкладка текущего чата*/}
                <div className='chat-page__main'>
                    {currentChat ? (
                        <div className='chat-page__current-chat-container'>
                            <div className='chat-page__messages'>
                                {currentChat.messages && currentChat.messages.length > 0 ? (
                                    currentChat.messages.map((message, index) => (
                                        <div key={index} className='chat-page__chat-message'>
                                            <div className='chat-page__message-content'>
                                                <strong>{message.username}</strong>: {message.text}
                                            </div>
                                            <div className='chat-page__message-date'>{formatMessageDateTime(message)}</div>
                                        </div>
                                    ))
                                ) : (<div className='chat-page__no-messages'>Сообщений пока нет</div>)}
                            </div>
                            <form className='chat-page__input-message' onSubmit={sendMessage}>
                                <textarea
                                    className='chat-page__input'
                                    placeholder='Сообщение...'
                                    name="text"
                                    value={messageData.text}
                                    onChange={changeMessageForm}
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
                                    ({getChatById(currentRoom.chatId).name})
                                </div>
                            </div>

                            <div className='chat-page__room-players-list-header'>
                                УЧАСТНИКИ – {currentRoom.players.length}:
                            </div>
                            <div className='chat-page__room-players-list'>
                                {currentRoom.players && currentRoom.players.length > 0 ? (
                                    currentRoom.players.map(player => (
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
                                    currentChat.rooms.map(room => (
                                        <div key={room.id} className='chat-page__room'>
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
                                                onClick={(e) => removeRoom(e, room)}
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
                                        <form className='chat-page__add-room-window-form' onSubmit={addRoom}>
                                            <input
                                                type='text'
                                                name='name'
                                                placeholder='Введите название комнаты'
                                                className='chat-page__add-room-window-input'
                                                value={roomData.name}
                                                onChange={changeRoomForm}
                                            />
                                            <input
                                                type='number'
                                                name='limit'
                                                placeholder='Введите лимит комнаты'
                                                className='chat-page__add-room-window-input'
                                                value={roomData.limit}
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

export default ChatsPage;