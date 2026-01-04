import './styles/GameCard.css'
import TrashIcon from '../assets/icons/trash.svg';
import { getPathForGame } from '../utils/pathFormat';

function GameCard({ game, onClick, onTrashClick, isSelected = false }) {
    const handleContainerClick = (e) => {
        // Предотвращаем срабатывание при клике на иконку корзины
        if (e.target.closest('.game-card__trash')) {
            return;
        }
        if (onClick) {
            onClick(game);
        }
    };

    return (
        <div
            className={`game-card__container ${isSelected ? 'game-card__container--selected' : ''}`}
            onClick={handleContainerClick}
        >
            {onTrashClick && (
                <img
                    src={TrashIcon}
                    className='game-card__trash'
                    onClick={(e) => {
                        e.stopPropagation();
                        onTrashClick(game);
                    }}
                    alt="Удалить"
                />
            )}

            <img
                className='game-card__image'
                src={getPathForGame(game.filepath)}
                alt={game.name}
            />
            <div className='game-card__name'>
                {game.name}
            </div>
        </div>
    );
}

export default GameCard;