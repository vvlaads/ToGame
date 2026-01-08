import './styles/UserCard.css';
import LikeIcon from '../assets/icons/like.svg';
import { getPathForImage } from '../utils/pathFormat';
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
            <img src={getPathForImage(user?.image)} className='user-card__image' />
            <div className='user-card__name'>{user?.name}</div>
            {onLikeClick && (<img src={LikeIcon} className='user-card__action' onClick={(e) => {
                e.stopPropagation();
                onLikeClick?.(user)
            }} />)}
        </div>
    );
}

export default UserCard;