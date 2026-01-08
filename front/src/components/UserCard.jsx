import './styles/UserCard.css';
import LikeIcon from '../assets/icons/like.svg';
import { getPathForAvatar } from '../utils/pathFormat';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';

function UserCard({ user, onClick, onLikeClick }) {
    const navigate = useNavigate();
    const { userInfoById } = useUser();
    const [userInfo, setUserInfo] = useState(null);

    // Переход к пользователю
    function goToUser() {
        navigate(`/profile/${user.id}`)
    }

    // Обработка клика
    function handleClick() {
        console.log(user);
        if (onClick) {
            onClick();
        } else {
            goToUser();
        }
    }

    useEffect(() => {
        async function fetchInfo() {
            const response = await userInfoById({ id: user.id })
            setUserInfo(response)
        }
        fetchInfo();
    }, [])

    return (
        <div className='user-card__container' onClick={handleClick}>
            <img src={getPathForAvatar(userInfo?.avatar?.filepath)} className='user-card__image' />
            <div className='user-card__name'>{userInfo?.name}</div>
            {onLikeClick && (<img src={LikeIcon} className='user-card__action' onClick={(e) => {
                e.stopPropagation();
                onLikeClick?.(userInfo)
            }} />)}
        </div>
    );
}

export default UserCard;