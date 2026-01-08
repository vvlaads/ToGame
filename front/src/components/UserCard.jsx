import './styles/UserCard.css';
import LikeIcon from '../assets/icons/like.svg';
import { getPathForAvatar, getPathForImage } from '../utils/pathFormat';
import { useNavigate } from 'react-router-dom';

function UserCard({ user, onClick, onLikeClick }) {
    const navigate = useNavigate();

    // Переход к пользователю
    function goToUser() {
        navigate(`/profile/${user.id}`)
    }

    // Обработка клика
    function handleClick() {
        if (onClick) {
            onClick();
        } else {
            goToUser();
        }
    }


    return (
        <div className='user-card__container' onClick={handleClick}>
            <img src={getPathForAvatar(user?.avatar?.filepath)} className='user-card__image' />
            <div className='user-card__name'>{user?.name}</div>
            {onLikeClick && (<img src={LikeIcon} className='user-card__action' onClick={(e) => {
                e.stopPropagation();
                onLikeClick?.(user)
            }} />)}
        </div>
    );
}

export default UserCard;