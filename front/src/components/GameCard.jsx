import './styles/GameCard.css'
import TrashIcon from '../assets/icons/trash.svg';
import { getPathForImage } from '../utils/imageFormat';


function GameCard({ game, onClick, onTrashClick }) {
    return (
        <div className='game-card__container' onClick={onClick}>
            <img src={TrashIcon} className='game-card__trash' onClick={onTrashClick} />

            <img
                className='game-card__image'
                src={getPathForImage(game.image)}
                alt={game.name}
            />
            <div className='game-card__name'>
                {game.name}
            </div>
        </div>
    )
}

export default GameCard;