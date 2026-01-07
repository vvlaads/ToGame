import './styles/MessageCard.css'
import { useUser } from '../context/UserContext';
import { useEffect, useState } from 'react';
import { formatMessageTime } from '../utils/timeFormat';

function MessageCard({ message, className }) {
    const [user, setUser] = useState(null);
    const { userInfoById } = useUser();

    // Загрузка доп информации
    useEffect(() => {
        async function fetchInfo() {
            const userInfo = await userInfoById({ id: message.senderId });
            setUser(userInfo);
        }

        fetchInfo();
    }, [])


    return (
        <div className={`message-card__container ${className}`}>
            <div className='message-card__main'>
                <span className='message-card__sender'>{user?.name}:</span>
                <span className='message-card__content'>{message.content}</span>
            </div>
            <div className='message-card__time'>{formatMessageTime(message.datetime)}</div>
        </div>
    );
}

export default MessageCard