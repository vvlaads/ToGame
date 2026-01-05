import './styles/ChatsPage.css'
import SendIcon from "../assets/icons/send.svg"
import CrossIcon from '../assets/icons/cross.svg';
import Modal from '../components/Modal';
import RoomCard from '../components/RoomCard';
import ChatCard from '../components/ChatCard';
import LayoutWithNav from '../components/LayoutWithNav';
import { useState } from 'react';
import { useChats } from '../context/ChatsContext';

function ChatsPage() {
    const { createChat, createRoom } = useChats();
    const [chats, setChats] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [currentRoom, setCurrentRoom] = useState(null);

    const [messageData, setMessageData] = useState({
        userId: 0,
        text: '',
        createdAt: 0,
        chatId: 0
    });

    const [roomFormIsOpen, setRoomFormIsOpen] = useState(false);
    const [roomData, setRoomData] = useState({
        name: '',
        chatId: 0,
    });

    const [chatFormIsOpen, setChatFormIsOpen] = useState(false);
    const [chatData, setChatData] = useState({
        name: '',
        descr: ''
    });

    // Присоединиться к комнате
    function joinToRoom() {

    }

    // Выйти из комнаты
    function leaveRoom() {

    }

    // Нажатие на кнопку Mute
    function handleMuteButton() {
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

    }

    // Отправка сообщения при нажатии Enter
    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(e);
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
            name: '',
            chatId: 0
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

    async function sendRoomForm(e) {
        e.preventDefault(); // Не перезагружать страницу
        await createRoom(roomData);
        closeRoomForm();
    }

    return (
        <LayoutWithNav>
            <div className='chat-page__container'>
                {/*Вкладка чатов*/}
                <div className='chat-page__chats'>
                    {chats.map(chat => (
                        <ChatCard
                            key={chat.id}
                            chat={chat}
                        />
                    ))}

                    <button
                        className='chat-page__create-button'
                        onClick={openChatForm}>
                        Добавить чат
                    </button>

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

                </div>



                {/*Вкладка текущего чата*/}
                <div className='chat-page__main'>
                    {currentChat ? (
                        <div className='chat-page__current-chat-container'>
                            <div className='chat-page__messages'>
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
                    {currentRoom ?
                        (
                            <div className='chat-page__current-room'>
                                <RoomCard
                                    room={currentRoom}
                                />
                            </div>
                        )
                        : (
                            <div>
                                {rooms.map(room => (
                                    <RoomCard
                                        room={room}
                                    />))}
                                < button className='chat-page__create-button' onClick={openRoomForm}>
                                    Добавить комнату
                                </button>
                            </div>

                        )}

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
                </div>
            </div>
        </LayoutWithNav >
    );
}

export default ChatsPage;