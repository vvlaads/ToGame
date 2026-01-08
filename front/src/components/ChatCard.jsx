import './styles/ChatCard.css';
import { getPathForImage } from '../utils/pathFormat';
import { useChats } from '../context/ChatsContext';
import { useEffect, useState } from 'react';
import { dateTimeToDate, formatMessageTime } from '../utils/timeFormat';
import { useUser } from '../context/UserContext';

function ChatCard({ chat, onClick, className }) {
    const { getMessages } = useChats();
    const { userInfoById } = useUser();
    const [sender, setSender] = useState(null);
    const [lastMessage, setLastMessage] = useState(null);

    // Загрузка последнего сообщения
    useEffect(() => {
        async function fetchMessages() {
            const messages = await getMessages(chat);
            const sorted = messages.sort((a, b) => dateTimeToDate(a.datetime).getTime() - dateTimeToDate(b.datetime).getTime());
            const lastMessage = sorted[sorted.length - 1];
            const sender = await userInfoById({ id: lastMessage.senderId });

            setLastMessage(lastMessage);
            setSender(sender);
        }

        fetchMessages();
    }, [chat])

    return (
        <div className={`chat-card__chat ${className}`} onClick={onClick}>
            <img
                className='chat-card__chat-image'
                src={getPathForImage(chat.image)}
            />
            <div className='chat-card__chat-info'>
                <div className='chat-card__chat-name'>{chat.name}</div>
                <div className='chat-card__chat-last-message-container'>
                    <span className='chat-card__chat-last-message'>
                        {sender?.name}: {lastMessage?.content}
                    </span>
                    <span className='chat-card__chat-time'>
                        {formatMessageTime(lastMessage?.datetime)}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default ChatCard;