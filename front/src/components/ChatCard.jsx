import './styles/ChatCard.css';
import { getPathForImage } from '../utils/pathFormat';
import { useChats } from '../context/ChatsContext';
import { useEffect, useState } from 'react';

function ChatCard({ chat, onClick, className }) {
    const { getMessages } = useChats();
    const [messages, setMessages] = useState([]);

    // Загрузка сообщений чата
    useEffect(() => {
        async function fetchMessages() {
            const responseBody = await getMessages(chat);
            setMessages(responseBody);
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
                        sender: lastMessage
                    </span>
                    <span className='chat-card__chat-time'>
                        date
                    </span>
                </div>
            </div>
        </div>
    );
}

export default ChatCard;