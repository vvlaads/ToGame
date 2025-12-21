import { useState, useEffect } from 'react';
import './styles/ChatCard.css';

function ChatCard({ chat, onClick, className }) {
    const [lastMessage, setLastMessage] = useState(null);

    // Преобразуем дату и время в timestamp для сравнения
    function getTimestamp(msg) {
        const [day, month, year] = msg.date.split('.').map(Number);
        const [hours, minutes] = msg.time.split(':').map(Number);
        return new Date(year, month - 1, day, hours, minutes).getTime();
    }

    useEffect(() => {
        function getLastMessage() {
            if (!chat.messages || chat.messages.length === 0) {
                setLastMessage(null);
                return;
            }

            const sortedMessages = [...chat.messages].sort((a, b) => {
                return getTimestamp(b) - getTimestamp(a);
            });
            setLastMessage(sortedMessages[0]);
        }

        getLastMessage();
    }, [chat.messages]);

    return (
        <div className={`chat-card__chat ${className}`} onClick={onClick}>
            <img
                className='chat-card__chat-avatar'
                src={chat.avatar}
                alt={`Аватар чата ${chat.name}`}
            />
            <div className='chat-card__chat-info'>
                <div className='chat-card__chat-name'>{chat.name}</div>
                <div className='chat-card__chat-last-message'>
                    {lastMessage ? `${lastMessage.name}: ${lastMessage.message}` : 'Нет сообщений'}
                </div>
                {lastMessage && (
                    <div className='chat-card__chat-time'>
                        {lastMessage.time}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatCard;