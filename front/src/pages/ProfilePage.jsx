import './styles/ProfilePage.css';
import LayoutWithNav from '../components/LayoutWithNav';
import { useAuth } from '../context/AuthContext';
import { getPathForGame, getPathForImage } from '../utils/pathFormat';
import { useGame } from '../context/GameContext';
import { useEffect, useState } from 'react';
import GameCard from '../components/GameCard';
import CrossIcon from '../assets/icons/cross.svg';
import AddIcon from '../assets/icons/add.svg';
import Modal from '../components/Modal';
import Tag from '../components/Tag';
import GamesListWithPagination from '../components/GamesListWithPagination';

function ProfilePage() {
    const { user, logout } = useAuth();
    const { getAllGames, getAllGamesByUser, addGame, removeGame } = useGame();
    const [userGames, setUserGames] = useState([]);
    const [allGames, setAllGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentGame, setCurrentGame] = useState(null);
    const [gameInfoIsOpen, setGameInfoIsOpen] = useState(false);
    const [gameListIsOpen, setGameListIsOpen] = useState(false);
    const [gamesToAdd, setGamesToAdd] = useState([]);


    // Открыть информацию по игре
    function openGameInfo(game) {
        setCurrentGame(game);
        setGameInfoIsOpen(true);
    };

    // Закрыть информацию по игре
    function closeGameInfo() {
        setCurrentGame(null);
        setGameInfoIsOpen(false);
    };

    // Открыть список игр для добавления
    function openGameList() {
        setGameListIsOpen(true);
    }

    // Закрыть список игр для добавления
    function closeGameList() {
        setGameListIsOpen(false);
    }

    // Выход из аккаунта
    function handleLogout() {
        logout();
    };


    // Обработчик выбора игр
    function handleGameSelect(game) {
        setGamesToAdd(prev => {
            const gameName = game.name;

            const isSelected = prev.some(g => g.name === gameName);

            return isSelected
                ? prev.filter(g => g.name !== gameName)
                : [...prev, game];
        });
    }

    // Добавить выбранные игры
    async function addGames() {
        try {
            for (const game of gamesToAdd) {
                await addGame({ name: game.name });
            }

            closeGameList();
            setGamesToAdd([]);

            const updatedUserGames = await getAllGamesByUser();
            setUserGames(updatedUserGames);

        } catch (error) {
            console.error('Ошибка при добавлении игр:', error);
        }
    }


    // Удалить выбранную игру
    async function deleteGame(gameName) {
        await removeGame({ name: gameName });
        if (gameInfoIsOpen) {
            closeGameInfo();
        }

        const updatedUserGames = await getAllGamesByUser();
        setUserGames(updatedUserGames);
    }

    // Получаем игры при загрузке компонента
    useEffect(() => {
        const fetchGames = async () => {
            setLoading(true);
            try {
                const userGames = await getAllGamesByUser();
                const allGames = await getAllGames();
                if (userGames && allGames) {
                    setUserGames(userGames);
                    setAllGames(allGames);
                }
                else {
                    throw Error();
                }
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


    // Заглушка на время загрузки
    if (loading) {
        return (
            <LayoutWithNav>
                <div className='profile-page__container'>
                    <div className="profile-page__loading">
                        <div className="profile-page__spinner"></div>
                    </div>
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

                        <div className='profile-page__games-grid'>
                            {userGames.map((game) => (
                                <GameCard
                                    key={game.name}
                                    game={game}
                                    onClick={() => openGameInfo(game)}
                                    onTrashClick={() => deleteGame(game.name)}
                                />
                            ))}
                            <div className='profile-page__add-game' onClick={openGameList}>
                                <img src={AddIcon} className='profile-page__add-game-icon' />
                                Добавить
                            </div>
                        </div>
                    </div>
                </div>

                <Modal isOpen={gameInfoIsOpen} onClose={closeGameInfo}>
                    {currentGame ?
                        (<div className='profile-page__game-modal-window'>
                            <img src={CrossIcon} className='profile-page__game-modal-window-cross' onClick={closeGameInfo} />

                            <img src={getPathForGame(currentGame.filepath)} className='profile-page__game-modal-window-image' />
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

                                <div className='profile-page__game-modal-window-tags'>
                                    {currentGame.tags.map(tag => (
                                        <Tag key={tag.name} tag={tag} />
                                    ))}
                                </div>

                                <button
                                    className='profile-page__game-modal-window-button'
                                    onClick={() => deleteGame(currentGame?.name)}>
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

                <Modal isOpen={gameListIsOpen} onClose={closeGameList}>
                    <div className='profile-page__game-list-window-container'>
                        <div className='profile-page__game-list-window-header'>Список игр</div>
                        <GamesListWithPagination
                            games={allGames.filter(
                                game => !userGames.some(userGame => userGame.name === game.name)
                            )}
                            selectedGames={gamesToAdd}
                            onGameSelect={handleGameSelect}
                        />
                        <div className='profile-page__game-list-window-buttons'>
                            <button
                                onClick={addGames}
                                className='profile-page__game-list-window-button'
                                id='profile-page__game-list-window-save'>
                                Сохранить
                            </button>
                            <button
                                onClick={closeGameList}
                                className='profile-page__game-list-window-button'
                                id='profile-page__game-list-window-cancel'>
                                Отмена
                            </button>
                        </div>

                    </div>
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