import './styles/UserCard.css';
import { getPathForImage } from '../utils/pathFormat';

function UserCard({ user, onClick }) {
    return (
        <div className='user-card__container' onClick={onClick}>
            <img src={getPathForImage(user.image)} className='user-card__image' />
            <div className='user-card__name'>{user.name}</div>
        </div>
    );
}

export default UserCard;