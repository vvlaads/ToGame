import { useState, useEffect } from 'react';
import './styles/ChatCard.css';
import { getChatLastMessageInfo } from '../utils/chatUtils';

function ChatCard({ chat, onClick, className }) {
    const [lastMessageInfo, setLastMessageInfo] = useState(() =>
        getChatLastMessageInfo(chat)
    );

    useEffect(() => {
        const info = getChatLastMessageInfo(chat);
        setLastMessageInfo(info);
    }, [chat]);

    return (
        <div className={`chat-card__chat ${className}`} onClick={onClick}>
            <img
                className='chat-card__chat-avatar'
                src={chat.avatar}
                alt={`Аватар чата ${chat.name}`}
            />
            <div className='chat-card__chat-info'>
                <div className='chat-card__chat-name'>{chat.name}</div>
                <div className='chat-card__chat-last-message-container'>
                    <span className='chat-card__chat-last-message'>
                        {lastMessageInfo.text}
                    </span>
                    {lastMessageInfo.datetime && (
                        <span className='chat-card__chat-time'>
                            {lastMessageInfo.datetime}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChatCard;