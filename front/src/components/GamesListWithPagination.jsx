import './styles/GamesListWithPagination.css';
import { useEffect, useMemo, useState } from 'react';
import LeftArrow from '../assets/icons/left arrow.svg';
import RightArrow from '../assets/icons/right arrow.svg';
import GameCard from './GameCard';

function GamesListWithPagination({
    games,
    selectedGames,
    onGameSelect,
    gamesPerPage = 5
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    // Фильтрация по поиску
    const filteredGames = useMemo(() => {
        return games.filter(game =>
            game.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [games, searchQuery]);

    // При изменении поиска — возвращаемся на первую страницу
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const indexOfLastGame = currentPage * gamesPerPage;
    const indexOfFirstGame = indexOfLastGame - gamesPerPage;
    const currentGames = filteredGames.slice(
        indexOfFirstGame,
        indexOfLastGame
    );
    const totalPages = Math.ceil(filteredGames.length / gamesPerPage);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className='games-list-with-pagination__container'>
            {/* Поиск */}
            <div className='games-list-with-pagination__top-bar'>
                <input
                    type='text'
                    placeholder='Поиск игр...'
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className='games-list-with-pagination__search'
                />
            </div>

            {/* Список игр */}
            <div className='games-list-with-pagination__games-grid'>
                {currentGames.length > 0 ? (
                    currentGames.map(game => {
                        const isSelected = selectedGames.some(
                            selected => selected.name === game.name
                        );

                        return (
                            <GameCard
                                key={game.name}
                                game={game}
                                isSelected={isSelected}
                                onClick={() => onGameSelect(game)}
                            />
                        );
                    })
                ) : (
                    <div className='games-list-with-pagination__empty'>
                        Ничего не найдено
                    </div>
                )}
            </div>

            {/* Пагинация */}
            {totalPages > 1 && (
                <div className='games-list-with-pagination__pagination'>
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className='games-list-with-pagination__pagination-button'
                    >
                        <img src={LeftArrow} />
                    </button>

                    <div className='games-list-with-pagination__page-numbers'>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={`games-list-with-pagination__page-number ${currentPage === page ? 'games-list-with-pagination__page-number--active' : ''
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className='games-list-with-pagination__pagination-button'
                    >
                        <img src={RightArrow} />
                    </button>
                </div>
            )}


            <div className='games-list-with-pagination__selected-count'>
                Выбрано игр: {selectedGames.length}
            </div>
        </div>
    );
}

export default GamesListWithPagination;
