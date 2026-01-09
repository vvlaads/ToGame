import './styles/ChatsPage.css'
import SendIcon from "../assets/icons/send.svg"
import CrossIcon from '../assets/icons/cross.svg';
import Modal from '../components/Modal';
import RoomCard from '../components/RoomCard';
import ChatCard from '../components/ChatCard';
import UserCard from '../components/UserCard';
import MessageCard from '../components/MessageCard';
import LayoutWithNav from '../components/LayoutWithNav';
import { useEffect, useState } from 'react';
import { useChats } from '../context/ChatsContext';
import { useUser } from '../context/UserContext';
import { getPathForChat } from '../utils/pathFormat';
import { useNavigate, useParams } from 'react-router-dom';
import { useVoiceRoom } from '../utils/useVoiceRoom';

function ChatsPage() {
    const navigate = useNavigate();
    const { chatId } = useParams();
    const { user, userInfo, userInfoById } = useUser();
    const [chats, setChats] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [currentRoomChatName, setCurrentRoomChatName] = useState('');
    const [currentChatInfoIsOpen, setCurrentChatInfoIsOpen] = useState(false);
    const [currentRoomUsers, setCurrentRoomUsers] = useState([]);
    const [ownerInfo, setOwnerInfo] = useState(null);
    const [currentChatUsers, setCurrentChatUsers] = useState([]);
    const [isMyChat, setIsMyChat] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const {
        createChat,
        updateChat,
        deleteChat,
        getMessages,
        sendMessage,
        createRoom,
        deleteRoom,
        joinRoom,
        leaveRoom,
        getChatUsers,
        getRooms,
        getUsersInRoom
    } = useChats();
    const {
        join,
        leave,
        toggleMute,
        toggleSelfTest,
        connected,
        connecting,
        selfTesting,
        muted,
        error
    } = useVoiceRoom();

    const [messageData, setMessageData] = useState({
        content: ''
    });

    const [roomFormIsOpen, setRoomFormIsOpen] = useState(false);
    const [roomData, setRoomData] = useState({
        name: ''
    });

    const [chatFormIsOpen, setChatFormIsOpen] = useState(false);
    const [chatData, setChatData] = useState({
        name: '',
        descr: '',
        filepath: ''
    });

    // Присоединиться к комнате
    async function handleJoinRoom(room) {
        await join();
        await joinRoom(room);
        setCurrentRoom(room);
        setCurrentRoomChatName(currentChat.name);
        const users = await getUsersInRoom(room);
        setCurrentRoomUsers(users);
        sessionStorage.setItem('currentRoom', JSON.stringify({
            room: room,
            chatName: currentChat.name,
            users: users
        }));
    }

    // Выйти из комнаты
    async function handleLeaveRoom() {
        leave();
        await leaveRoom(currentRoom);
        setCurrentRoom(null);
        setCurrentRoomChatName('');
        setCurrentRoomUsers([]);
        sessionStorage.removeItem('currentRoom');
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
    async function sendMessageForm(e) {
        e.preventDefault();

        const trimmed = messageData.content.trim();
        if (!trimmed) return;

        await sendMessage({
            ...messageData,
            chatId: currentChat.id,
            senderId: user.id
        });
        setMessageData({
            content: ''
        });
        updateMessages();
    }

    // Отправка сообщения при нажатии Enter
    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessageForm(e);
        }
    }

    // Открыть окно создания чата
    function openChatForm() {
        setIsEditMode(false);
        setChatData({
            name: '',
            descr: '',
            filepath: ''
        });
        setChatFormIsOpen(true);
    }

    // Закрыть окно создания чата
    function closeChatForm() {
        setChatFormIsOpen(false);
        setIsEditMode(false);
        setChatData({
            name: '',
            descr: '',
            filepath: ''
        });
    }

    // Обновляем данные о новом чате
    function handleChatFormChange(e) {
        const { name, value } = e.target;
        setChatData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    // Обновить список чатов
    async function updateChats() {
        const responseUser = await userInfo();
        setChats(responseUser.chats);
    }

    // Обновить список комнат
    async function updateRooms() {
        const rooms = await getRooms(currentChat);
        setRooms(rooms);
    }

    // Обновить список сообщений
    async function updateMessages() {
        const messages = await getMessages(currentChat);
        setMessages(messages);
    }

    // отправить запрос на создания чата
    async function sendChatForm(e) {
        e.preventDefault(); // Не перезагружать страницу
        if (isEditMode) {
            await updateChat({ ...currentChat, ...chatData });
        } else {
            await createChat(chatData);
        }
        setChatData({
            name: '',
            descr: '',
            filepath: ''
        });
        closeChatForm();
        updateChats();
    }

    // Открыть окно создания комнаты
    function openRoomForm() {
        setRoomFormIsOpen(true);
    };

    // Закрыть окно создания комнаты
    function closeRoomForm() {
        setRoomFormIsOpen(false);
        setRoomData({
            name: ''
        })
        setIsEditMode(false);
    };

    // Обновляем данные о новой комнате
    function handleRoomFormChange(e) {
        const { name, value } = e.target;
        setRoomData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    // Отправить запрос на создание новой комнаты
    async function sendRoomForm(e) {
        e.preventDefault(); // Не перезагружать страницу
        await createRoom({ ...roomData, chatId: currentChat.id });
        closeRoomForm();
        updateRooms();
    }

    // Открыть окно информации о чате
    async function openCurrentChatInfo() {
        setCurrentChatInfoIsOpen(true);
        const userInfo = await userInfoById({ id: currentChat.ownerId });
        if (user.id === currentChat.ownerId) {
            setIsMyChat(true);
        }
        console.log(userInfo);
        setOwnerInfo(userInfo);
    }

    // Закрыть окно информации о чате
    function closeCurrentChatInfo() {
        setCurrentChatInfoIsOpen(false);
        setOwnerInfo(null);
        setIsMyChat(false);
    }

    // Обработка нажатия на чат
    function handleChatClick(chat) {
        sessionStorage.setItem('chatId', chat.id);
        if (currentChat && currentChat.id === chat.id) {
            openCurrentChatInfo();
        }
        navigate(`/chats/${chat.id}`);
    }

    // Отправка запроса на удаление чата
    async function handleDeleteChat() {
        await deleteChat(currentChat);
        closeCurrentChatInfo();
        updateChats();
    }

    // Отправка запроса на удаление комнаты
    async function handleDeleteRoom(room) {
        await deleteRoom(room);
        updateRooms();
    }

    function handleEditChat() {
        setIsEditMode(true);
        closeCurrentChatInfo();

        setChatData({
            name: currentChat.name,
            descr: currentChat.descr,
            filepath: currentChat.filepath,
        });

        setChatFormIsOpen(true);
    }


    // Загрузка информации о чатах
    useEffect(() => {
        updateChats();
        const roomInfoRaw = sessionStorage.getItem('currentRoom');

        if (!chatId) {
            const savedChatId = sessionStorage.getItem('chatId');
            if (savedChatId) {
                navigate(`/chats/${savedChatId}`);
            }
        }

        if (roomInfoRaw) {
            const roomInfo = JSON.parse(roomInfoRaw);

            setCurrentRoom(roomInfo.room);
            setCurrentRoomChatName(roomInfo.chatName);
            setCurrentRoomUsers(roomInfo.users);
        }

    }, []);

    useEffect(() => {
        if (!chatId || chats.length === 0) return;

        const numericChatId = Number(chatId);
        const chatFromUrl = chats.find(chat => chat.id === numericChatId);

        if (chatFromUrl) {
            setCurrentChat(chatFromUrl);
        }
    }, [chatId, chats]);

    // Загрузка сообщений и комнат текущего чата
    useEffect(() => {
        async function fetchMessages() {
            if (!currentChat) {
                return;
            }

            updateMessages();
        }

        async function fetchRooms() {
            if (!currentChat) {
                return;
            }

            updateRooms();
        }

        async function fetchUsers() {
            if (!currentChat) {
                return;
            }

            const users = await getChatUsers(currentChat);
        }

        fetchUsers();
        fetchMessages();
        fetchRooms();
    }, [currentChat])

    return (
        <LayoutWithNav>
            <div className='chat-page__container'>
                {/*Вкладка чатов*/}
                <div className='chat-page__chats'>
                    {chats.map(chat => (
                        <ChatCard
                            key={chat.id}
                            chat={chat}
                            onClick={() => handleChatClick(chat)}
                            className={currentChat && currentChat.id === chat.id ? 'chat-page__chat--active' : ''}
                        />
                    ))}

                    <button
                        className='chat-page__create-button'
                        onClick={openChatForm}>
                        Добавить чат
                    </button>


                </div>



                {/*Вкладка текущего чата*/}
                <div className='chat-page__main'>
                    {currentChat ? (
                        <div className='chat-page__current-chat-container'>
                            <div className='chat-page__messages'>
                                {messages.map(message =>
                                    <MessageCard
                                        key={message.datetime}
                                        message={message}
                                        className={user.id === message.senderId ? 'chat-page__my-message' : ''}
                                    />
                                )}
                            </div>

                            <form className='chat-page__input-message' onSubmit={sendMessageForm}>
                                <textarea
                                    className='chat-page__input'
                                    placeholder='Сообщение...'
                                    name="content"
                                    value={messageData.content}
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
                    {currentRoom ?
                        (
                            <div className='chat-page__current-room-container'>
                                <RoomCard
                                    room={currentRoom}
                                    chatName={currentRoomChatName}
                                    isActive={true}
                                />

                                <div>
                                    <div className='chat-page__current-room-users-header'>
                                        Участники:
                                    </div>
                                    <div className='chat-page__current-room-users'>
                                        {currentRoomUsers.map(user =>
                                            <UserCard user={user} />
                                        )}
                                    </div>
                                </div>

                                <div className='chat-page__current-room-bottom'>
                                    <button
                                        onClick={toggleSelfTest}
                                        disabled={!connected}
                                        className={`chat-page__test-button ${selfTesting ? 'chat-page__test-button--active' : ''
                                            }`}
                                    >
                                        {selfTesting ? 'Остановить проверку' : 'Проверить микрофон'}
                                    </button>

                                    <button
                                        className={`chat-page__mute-button ${muted ? 'chat-page__mute-button--active' : ''}`}
                                        onClick={toggleMute}
                                        disabled={!connected}
                                    >
                                        {muted ? 'Включить микро' : 'Выключить микро'}
                                    </button>
                                    <button
                                        id='chat-page__leave-room'
                                        onClick={handleLeaveRoom}>
                                        Покинуть комнату
                                    </button>
                                </div>
                            </div>
                        )
                        : (
                            <div className='chat-page__rooms'>
                                {rooms.map(room => (
                                    <RoomCard
                                        key={room.id}
                                        room={room}
                                        onClick={() => handleJoinRoom(room)}
                                        onTrashClick={() => handleDeleteRoom(room)}
                                        isOwner={currentChat.ownerId === user.id}
                                    />))}
                                {currentChat && currentChat.ownerId === user.id && (<button className='chat-page__create-button' onClick={openRoomForm}>
                                    Добавить комнату
                                </button>)}
                            </div>

                        )}
                </div>

                <Modal isOpen={chatFormIsOpen} onClose={closeChatForm}>

                    <form onSubmit={sendChatForm} className='chat-page__form'>
                        <img src={CrossIcon} className='chat-page__form-cross' onClick={closeChatForm} />
                        <div className='chat-page__form-header'> {isEditMode ? 'Редактирование чата' : 'Создание чата'}</div>

                        <div className='chat-page__form-group'>
                            <label className='chat-page__label'>Название</label>
                            <input
                                type='text'
                                name='name'
                                className='chat-page__form-input'
                                placeholder='Введите название'
                                value={chatData.name}
                                onChange={handleChatFormChange}
                                required
                            />
                        </div>
                        <div className='chat-page__form-group'>
                            <label className='chat-page__label'>Описание</label>
                            <textarea
                                type='text'
                                name='descr'
                                className='chat-page__form-input'
                                placeholder='Введите описание'
                                value={chatData.descr}
                                onChange={handleChatFormChange}
                                required
                            />
                        </div>

                        <div className='chat-page__form-group'>
                            <label className='chat-page__label'>Изображение</label>
                            <select
                                name='filepath'
                                value={chatData.filepath}
                                onChange={handleChatFormChange}
                                className='profile-page__form-input'
                            >
                                <option value="">Выберите вариант</option>
                                <option value="ball.svg">Шар</option>
                                <option value="bomb.svg">Бомба</option>
                                <option value="focus.svg">Цель</option>
                                <option value="gamepad.svg">Геймпад</option>
                                <option value="mouse.svg">Мышь</option>
                                <option value="nintendo.svg">Нинтендо</option>
                                <option value="pacman.svg">PacMan</option>
                                <option value="shield.svg">Щит</option>
                                <option value="sword.svg">Меч</option>
                            </select>
                        </div>

                        <div className='chat-page__form-group'>
                            <label className='chat-page__label'>Участники</label>
                            {/*TODO: Выбор из друзей*/}
                        </div>
                        <div className='chat-page__form-buttons'>
                            <button type='submit' className='chat-page__form-button' id='chat-page__form-submit'>
                                {isEditMode ? 'Сохранить' : 'Создать'}
                            </button>
                            <button type='button' className='chat-page__form-button' id='chat-page__form-cancel' onClick={closeChatForm}>
                                Отмена
                            </button>
                        </div>
                    </form>
                </Modal>

                < Modal isOpen={roomFormIsOpen} onClose={closeRoomForm}>
                    <form onSubmit={sendRoomForm} className='chat-page__form'>
                        <img src={CrossIcon} className='chat-page__form-cross' onClick={closeRoomForm} />
                        <div className='chat-page__form-header'>Создание комнаты</div>

                        <div className='chat-page__form-group'>
                            <label className='chat-page__label'>Название</label>
                            <input
                                type='text'
                                name='name'
                                className='chat-page__form-input'
                                placeholder='Введите название'
                                value={roomData.name}
                                onChange={handleRoomFormChange}
                                required
                            />
                        </div>
                        <div className='chat-page__form-buttons'>
                            <button type='submit' className='chat-page__form-button' id='chat-page__form-submit'>
                                Создать
                            </button>
                            <button type='button' className='chat-page__form-button' id='chat-page__form-cancel' onClick={closeRoomForm}>
                                Отмена
                            </button>
                        </div>
                    </form>
                </Modal>

                <Modal isOpen={currentChatInfoIsOpen} onClose={closeCurrentChatInfo}>
                    <div className='chat-page__chat-info-window'>
                        <img src={CrossIcon} className='chat-page__form-cross' onClick={closeCurrentChatInfo} />

                        <div className='chat-page__chat-info-window-header'>
                            <img className='chat-page__chat-info-window-chat-image'
                                src={getPathForChat(currentChat?.filepath)}
                            />
                            <div className='chat-page__chat-info-window-chat-name'>
                                {currentChat?.name}
                            </div>
                        </div>

                        <div>
                            <div className='chat-page__chat-info-window-label'>Описание:</div>
                            <div className='chat-page__chat-info-window-chat-descr'>
                                {currentChat?.descr}
                            </div>
                        </div>

                        <div>
                            <div className='chat-page__chat-info-window-label'>Владелец:</div>
                            {ownerInfo && <UserCard
                                user={ownerInfo}
                            />}
                        </div>

                        <div>
                            <div className='chat-page__chat-info-window-label'>Участники:</div>
                            <div>
                                {currentChatUsers.map(user =>
                                    <UserCard
                                        user={user}
                                    />
                                )}
                            </div>
                        </div>

                        {isMyChat && (
                            <div className='chat-page__chat-info-window-buttons'>
                                <button
                                    id='chat-page__chat-info-window-edit'
                                    onClick={handleEditChat}>
                                    Редактировать чат
                                </button>
                                <button
                                    id='chat-page__chat-info-window-delete'
                                    onClick={handleDeleteChat}>
                                    Удалить чат
                                </button>
                            </div>
                        )}

                    </div>
                </Modal>
            </div>
        </LayoutWithNav >
    );
}

export default ChatsPage;