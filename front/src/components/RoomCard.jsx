import './styles/RoomCard.css';
import TrashIcon from '../assets/icons/trash.svg';
import { useEffect, useState } from 'react';
import { useChats } from '../context/ChatsContext';

function RoomCard({ room, chatName, onClick, onTrashClick, isActive = false, isOwner = false }) {
    const [userCount, setUserCount] = useState(0); //TODO: получение числа участников
    const { getUsersInRoom } = useChats();

    useEffect(() => {
        async function fetchUsers() {
            const responseBody = await getUsersInRoom(room);
            setUserCount(responseBody.length);
        }

        fetchUsers();
    }, [])

    return (
        <div onClick={onClick} className={`room-card__container ${isActive ? 'room-card__container--active' : ''}`}>
            <div className='room-card__main'>
                <div className='room-card__name'>
                    {room.name}
                </div>
                {isActive ?
                    (<div className='room-card__info'>
                        <span>Чат: {chatName}</span>
                    </div>)
                    : (
                        <div className='room-card__info'>
                            <span>Участники: {userCount}</span>
                        </div >
                    )
                }
            </div>

            {!isActive && isOwner && (
                <img
                    src={TrashIcon}
                    className='room-card__trash-icon'
                    onClick={(e) => {
                        e.stopPropagation();
                        onTrashClick?.(room);
                    }} />
            )}
        </div >
    );
}

export default RoomCard;