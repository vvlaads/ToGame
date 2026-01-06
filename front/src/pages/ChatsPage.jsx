import './styles/ChatsPage.css'
import SendIcon from "../assets/icons/send.svg"
import CrossIcon from '../assets/icons/cross.svg';
import Modal from '../components/Modal';
import RoomCard from '../components/RoomCard';
import ChatCard from '../components/ChatCard';
import LayoutWithNav from '../components/LayoutWithNav';
import { useEffect, useState } from 'react';
import { useChats } from '../context/ChatsContext';
import { useUser } from '../context/UserContext';
import UserCard from '../components/UserCard';
import { getPathForImage } from '../utils/pathFormat';
import MessageCard from '../components/MessageCard';
import { useNavigate, useParams } from 'react-router-dom';

function ChatsPage() {
    const navigate = useNavigate();
    const { chatId } = useParams();
    const { user, userInfoById } = useUser();
    const { createChat, deleteChat, getMessages, sendMessage, createRoom, deleteRoom, joinRoom, leaveRoom } = useChats();
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
    const [isMute, setIsMute] = useState(false);

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
        descr: ''
    });

    // Присоединиться к комнате
    async function handleJoinRoom(room) {
        await joinRoom(room);
        setCurrentRoom(room);
        setCurrentRoomChatName(currentChat.name);
        setCurrentRoomUsers([user, user, user]); //TODO: Получить список участников комнаты
    }

    // Выйти из комнаты
    async function handleLeaveRoom() {
        await leaveRoom(currentRoom);
        setCurrentRoom(null);
        setCurrentRoomChatName('');
        setCurrentRoomUsers([]);
    }

    // Нажатие на кнопку Mute
    function handleMuteButton() {
        setIsMute(!isMute);
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
        const messages = await getMessages(currentChat);
        setMessages(messages);
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
        setChatFormIsOpen(true);
    }

    // Закрыть окно создания чата
    function closeChatForm() {
        setChatFormIsOpen(false);
        setChatData({
            name: '',
            descr: ''
        });
    }

    function handleChatFormChange(e) {
        const { name, value } = e.target;
        setChatData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    // отправить запрос на создания чата
    async function sendChatForm(e) {
        e.preventDefault(); // Не перезагружать страницу
        await createChat(chatData);
        closeChatForm();
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
    }

    async function openCurrentChatInfo() {
        setCurrentChatInfoIsOpen(true);
        const userInfo = await userInfoById({ id: currentChat.ownerId });
        if (user.id === currentChat.ownerId) {
            setIsMyChat(true);
        }
        setOwnerInfo(userInfo);
    }

    function closeCurrentChatInfo() {
        setCurrentChatInfoIsOpen(false);
        setOwnerInfo(null);
        setIsMyChat(false);
    }

    // Обработка нажатия на чат
    function handleChatClick(chat) {
        if (currentChat && currentChat.id === chat.id) {
            openCurrentChatInfo();
        }
        navigate(`/chats/${chat.id}`);
    }

    async function handleDeleteChat() {
        await deleteChat(currentChat);
        closeCurrentChatInfo();
    }

    async function handleDeleteRoom(room) {
        await deleteRoom(room);
    }

    // Загрузка информации о чатах
    useEffect(() => {
        async function fetchChats() {
            const chatsFromApi = [
                { id: 13, descr: 'd', name: 'd', ownerId: 2 },
                { id: 12, descr: 'aaaa', name: 'aaa', ownerId: 2 }
            ];
            setChats(chatsFromApi);
        }

        fetchChats();
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

            const messages = await getMessages(currentChat);
            setMessages(messages);
        }

        async function fetchRooms() {
            if (!currentChat) {
                return;
            }

            const rooms = [
                { id: 2, name: 'test', chatId: 13 }
            ] //TODO: получение списка комнат
            setRooms(rooms);
        }

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
                                        key={message.time}
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
                                        className={`chat-page__mute-button ${isMute ? 'chat-page__mute-button--active' : ''}`}
                                        onClick={handleMuteButton}>
                                        {isMute ? 'Включить микро' : 'Выключить микро'}
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
                        <div className='chat-page__form-header'>Создание чата</div>

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
                        <div className='chat-page__form-buttons'>
                            <button type='submit' className='chat-page__form-button' id='chat-page__form-submit'>
                                Создать
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
                                src={getPathForImage(currentChat?.image)}
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
                            <UserCard
                                user={ownerInfo}
                            />
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
                            <button
                                id='chat-page__chat-info-window-delete'
                                onClick={handleDeleteChat}>
                                Удалить чат
                            </button>
                        )}

                    </div>
                </Modal>
            </div>
        </LayoutWithNav >
    );
}

export default ChatsPage;