import './styles/ProfilePage.css';
import LayoutWithNav from '../components/LayoutWithNav';
import { useAuth } from '../context/AuthContext';
import { getPathForImage } from '../utils/imageFormat';
import { useGame } from '../context/GameContext';
import { useEffect, useState } from 'react';
import GameCard from '../components/GameCard';
import CrossIcon from '../assets/icons/cross.svg';
import Modal from '../components/Modal';
import Tag from '../components/Tag';

function ProfilePage() {
    const { user, logout } = useAuth();
    const { games, getGameList, findTagsForGame, deleteGameForUser } = useGame();
    const [loading, setLoading] = useState(true);
    const [currentGame, setCurrentGame] = useState(null);
    const [currentGameTags, sebtCurrentGameTags] = useState([]);
    const [gameInfoIsOpen, setGameInfoIsOpen] = useState(false);
    const [gameListIsOpen, setGameListIsOpen] = useState(false);


    // Открыть модальное окно
    function openGameInfo(game) {
        setCurrentGame(game);
        setGameInfoIsOpen(true);
    };

    // Закрыть модальное окно
    function closeGameInfo() {
        setCurrentGame(null);
        setGameInfoIsOpen(false);
    };
    // Открыть модальное окно
    function openGameList() {
        setGameListIsOpen(true);
    }
    // Закрыть модальное окно
    function closeGameList() {
        setGameListIsOpen(false);
    }

    // Выход из аккаунта
    function handleLogout() {
        logout();
    };

    function deleteGame(e, gameId) {
        e.stopPropagation();
        deleteGameForUser(gameId);
        if (gameInfoIsOpen) {
            closeGameInfo();
        }
    }

    function addGame() {
        if (gameListIsOpen) {
            closeGameList();
        }
    }

    // Получаем игры при загрузке компонента
    useEffect(() => {
        const fetchGames = async () => {
            setLoading(true);
            try {
                await getGameList();
            } catch (error) {
                console.error('Ошибка загрузки игр:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchGames();
        }
    }, [user]);

    // Обновление тегов для игры
    useEffect(() => {
        async function fetchTags() {
            if (currentGame) {
                const tags = await findTagsForGame(currentGame.id);
                setCurrentGameTags(tags);
            }
        }
        fetchTags();
    }, [currentGame])

    if (loading) {
        return (
            <LayoutWithNav>
                <div className='profile-page__container'>
                    <div className="loading">Загрузка...</div>
                </div>
            </LayoutWithNav>
        );
    }

    return (
        <LayoutWithNav>
            <div className="profile-page__container">
                <div className="profile-page__content">
                    <div className='profile-page__header'>
                        <img className='profile-page__image' src={getPathForImage(user.bannerImage)} />
                        <div className='profile-page__user-info'>
                            <img className='profile-page__user-image' src={getPathForImage(user.image)} />
                            <div className='profile-page__info'>
                                <div className='profile-page__username'>{user?.name}</div>
                                <div className='profile-page__id'>#{user?.id?.toString().padStart(7, '0')}</div>
                            </div>
                        </div>
                    </div>

                    <div className='profile-page__user-descr'>
                        {user.descr}
                    </div >

                    <div className='profile-page__game-list'>
                        <h3>Любимые игры:</h3>

                        {games && games.length > 0 ? (
                            <div className='profile-page__games-grid'>
                                {games.map((game) => (
                                    <GameCard
                                        key={game.id}
                                        game={game}
                                        onClick={() => openModal(game)}
                                        onTrashClick={(e) => deleteGame(e, game.id)}
                                    />
                                ))}
                                <div className='profile-page__add-game' onClick={openGameList}>
                                    Добавить
                                </div>
                            </div>
                        ) : (
                            <div className='profile-page__no-games'>
                                Игры не добавлены
                            </div>
                        )}
                    </div>
                </div>

                <Modal isOpen={gameInfoIsOpen} onClose={closeGameInfo}>
                    {currentGame ?
                        (<div className='profile-page__game-modal-window'>
                            <img src={CrossIcon} className='profile-page__game-modal-window-cross' onClick={closeGameInfo} />

                            <img src={currentGame?.image} className='profile-page__game-modal-window-image' />
                            <div className='profile-page__game-modal-window-text'>
                                <div className='profile-page__game-modal-window-name'>
                                    {currentGame?.name}
                                </div>
                                <div className='profile-page__game-modal-window-descr'>
                                    {currentGame?.descr}
                                </div>
                                <div className='profile-page__game-modal-window-tag-header'>
                                    ТЕГИ:
                                </div>
                                {currentGameTags && currentGameTags.length > 0 ?
                                    (<div className='profile-page__game-modal-window-tags'>
                                        {currentGameTags.map(tag => (
                                            <Tag key={tag.id} tag={tag} />
                                        ))}
                                    </div>)
                                    : (<div className='profile-page__game-modal-window-tags'>Не найдено тегов...</div>)}

                                <button
                                    className='profile-page__game-modal-window-button'
                                    onClick={(e) => deleteGame(e, currentGame?.id)}>
                                    Удалить
                                </button>
                            </div>
                        </div>)
                        : (
                            <div className='profile-page__game-modal-window'>
                                Загрузка...
                            </div>
                        )}

                </Modal>

                <div className='profile-page__exit-button-container'>
                    <button className='profile-page__exit-button' onClick={handleLogout}>
                        Выйти
                    </button>
                </div>
            </div>
        </LayoutWithNav>
    );
}

export default ProfilePage;