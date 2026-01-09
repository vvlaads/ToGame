import './styles/ChatCard.css';
import { getPathForChat } from '../utils/pathFormat';
import { useChats } from '../context/ChatsContext';
import { useEffect, useState } from 'react';
import { dateTimeToDate, formatMessageTime } from '../utils/timeFormat';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

function ChatCard({ chat, onClick, className }) {
    const navigate = useNavigate();
    const { getMessages } = useChats();
    const { userInfoById } = useUser();
    const [lastMessage, setLastMessage] = useState(null);
    const [sender, setSender] = useState(null);

    // Переход к чату
    function goToChat() {
        navigate(`/chats/${chat.id}`);
        sessionStorage.setItem('chatId', chat.id);
    }

    // Обработка нажатия
    function handleClick() {
        if (onClick) {
            onClick();
        } else {
            goToChat();
        }
    }

    // Загрузка последнего сообщения
    useEffect(() => {
        async function fetchMessages() {
            const messages = await getMessages(chat);
            const sorted = messages.sort((a, b) => dateTimeToDate(a.datetime).getTime() - dateTimeToDate(b.datetime).getTime());
            const lastMessage = sorted[sorted.length - 1];
            setLastMessage(lastMessage);
            if (lastMessage) {
                const sender = await userInfoById({ id: lastMessage.senderId });
                setSender(sender);
            }
        }

        fetchMessages();
    }, [chat])

    return (
        <div className={`chat-card__chat ${className}`} onClick={handleClick}>
            <img
                className='chat-card__chat-image'
                src={getPathForChat(chat.filepath)}
            />
            <div className='chat-card__chat-info'>
                <div className='chat-card__chat-name'>{chat.name}</div>
                <div className='chat-card__chat-last-message-container'>
                    {lastMessage && (
                        <span className='chat-card__chat-last-message'>
                            {sender?.name}: {lastMessage?.content}
                        </span>)}
                    <span className='chat-card__chat-time'>
                        {formatMessageTime(lastMessage?.datetime)}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default ChatCard;