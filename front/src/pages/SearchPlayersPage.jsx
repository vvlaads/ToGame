import './styles/SearchPlayersPage.css';
import LayoutWithNav from '../components/LayoutWithNav';
import { useState } from 'react';
import LeftArrow from '../assets/icons/left arrow.svg';
import RightArrow from '../assets/icons/right arrow.svg';

function SearchPlayersPage() {
    const [users, setUsers] = useState([
        {
            id: 1,
            name: 'Capa',
            descr: 'Люблю играть в игры!',
            genres: ['Шутер', 'Батл-рояль', 'Стратегия'],
            games: ['Overwatch', 'Apex Legends']
        },
        {
            id: 2,
            name: 'Next',
            descr: 'Новый игрок в команде!',
            genres: ['РПГ', 'Экшен', 'Приключения'],
            games: ['The Witcher 3', 'Cyberpunk 2077']
        },
        {
            id: 3,
            name: 'GamerPro',
            descr: 'Профессиональный киберспортсмен',
            genres: ['МОБА', 'Спортивные', 'Гонки'],
            games: ['Dota 2', 'CS:GO', 'Rocket League']
        }
    ]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const currentUser = users[currentIndex];

    function nextUser() {
        setCurrentIndex((prevIndex) =>
            prevIndex === users.length - 1 ? 0 : prevIndex + 1
        );
    }

    function prevUser() {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? users.length - 1 : prevIndex - 1
        );
    }

    return (
        <LayoutWithNav>
            <div className='search-players-page__container'>
                <div className='search-players-page__card'>
                    <div className='search-players-page__button-container'>
                        <button onClick={prevUser} className='search-players-page__button search-players-page__button--prev'>
                            <img src={LeftArrow} alt="Назад" className='search-players-page___icon' />
                        </button>
                    </div>
                    <div className='search-players-page__info'>
                        {/* Заглушка для аватара */}
                        <div className='search-players-page__avatar'>

                        </div>

                        <div className='search-players-page__name'>{currentUser.name}</div>
                        <div className='search-players-page__descr'>{currentUser.descr}</div>

                        <div className='search-players-page__section'>
                            <div className='search-players-page__label'>ЖАНРЫ:</div>
                            <div className='search-players-page__genres'>
                                {currentUser.genres.map((genre, index) => (
                                    <div key={index} className='search-players-page__genre'>
                                        {genre}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='search-players-page__section'>
                            <div className='search-players-page__label'>ИГРАЕТ В:</div>
                            <div className='search-players-page__games'>
                                {currentUser.games.map((game, index) => (
                                    <div key={index} className='search-players-page__game'>
                                        {game}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            className='search-players-page__success-button'
                            onClick={nextUser}>
                            Написать
                        </button>
                    </div>
                    <div className='search-players-page__button-container'>
                        <button onClick={nextUser} className='search-players-page__button search-players-page__button--next'>
                            <img src={RightArrow} alt="Далее" className='search-players-page___icon' />
                        </button>
                    </div>
                </div>
            </div>
        </LayoutWithNav>
    );
}

export default SearchPlayersPage;