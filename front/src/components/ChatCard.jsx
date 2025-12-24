import './styles/ChatCard.css';
import { useState, useEffect } from 'react';
import { getPathForImage } from '../utils/imageFormat';
import { useChats } from '../context/ChatsContext';
import { useAuth } from '../context/AuthContext';
import { formatTimestamp } from '../utils/chatUtils';

function ChatCard({ chat, onClick, className }) {
    const { getLastMessage } = useChats();
    const { getUserInfo } = useAuth()

    const [lastMessage, setLastMessage] = useState(null);
    const [senderName, setSenderName] = useState('');


    useEffect(() => {
        const fetchLastMessage = async () => {
            const response = await getLastMessage(chat.id);
            if (response) {
                setLastMessage(response);
            }
        };

        fetchLastMessage();
    }, [chat, getLastMessage]);

    // Загружаем имя отправителя, когда есть lastMessage
    useEffect(() => {
        const fetchSenderName = async () => {
            if (!lastMessage?.userId) {
                setSenderName('');
                return;
            }

            try {
                const userResponse = await getUserInfo(lastMessage.userId);
                if (userResponse) {
                    setSenderName(userResponse.name);
                } else {
                    setSenderName('Неизвестно');
                }
            } catch (error) {
                console.error('Ошибка загрузки информации об отправителе:', error);
                setSenderName('Неизвестно');
            }
        };

        fetchSenderName();
    }, [lastMessage, getUserInfo]);

    return (
        <div className={`chat-card__chat ${className}`} onClick={onClick}>
            <img
                className='chat-card__chat-avatar'
                src={getPathForImage(chat.image)}
                alt={`Изображение чата ${chat.name}`}
            />
            <div className='chat-card__chat-info'>
                <div className='chat-card__chat-name'>{chat.name}</div>
                <div className='chat-card__chat-last-message-container'>
                    <span className='chat-card__chat-last-message'>
                        {senderName}: {lastMessage?.text}
                    </span>
                    {lastMessage?.createdAt && (
                        <span className='chat-card__chat-time'>
                            {formatTimestamp(lastMessage?.createdAt)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChatCard;