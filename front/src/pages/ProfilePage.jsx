import './styles/ProfilePage.css';
import AddIcon from '../assets/icons/add.svg';
import CrossIcon from '../assets/icons/cross.svg';
import SettingsIcon from '../assets/icons/settings.svg';
import Tag from '../components/Tag';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import UserCard from '../components/UserCard';
import GameCard from '../components/GameCard';
import LayoutWithNav from '../components/LayoutWithNav';
import GamesListWithPagination from '../components/GamesListWithPagination';
import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { useGame } from '../context/GameContext';
import { getPathForGame, getPathForImage } from '../utils/pathFormat';
import { useParams } from 'react-router-dom';


function ProfilePage() {

    const { userId } = useParams();
    const { user, logout, getFriends, userInfoById } = useUser();
    const { getAllGames, getAllGamesByUser, addGame, removeGame } = useGame();
    const [currentUser, setCurrentUser] = useState(null);
    const [friends, setFriends] = useState([]);
    const [userGames, setUserGames] = useState([]);
    const [allGames, setAllGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentGame, setCurrentGame] = useState(null);
    const [gameInfoIsOpen, setGameInfoIsOpen] = useState(false);
    const [gameListIsOpen, setGameListIsOpen] = useState(false);
    const [gamesToAdd, setGamesToAdd] = useState([]);
    const [isEditMode, setEditMode] = useState(false);
    const [userData, setUserData] = useState({ descr: '' });
    const isMyProfile = !userId || Number(userId) === user.id;


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

    // Открыть режим редактирования
    function openEditMode() {
        setEditMode(true);
    }

    // Закрыть режим редактирования
    function closeEditMode() {
        setEditMode(false);
    }

    // Выход из аккаунта
    function handleLogout() {
        logout();
    };

    function handleUserFormChange(e) {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    // Обновить информацию о пользователе
    function updateUser(e) {
        e.preventDefault(); // Не перезагружать страницу
        //TODO: отправка запроса к API
        closeEditMode();
    }


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

    // Загрузка игр и друзей
    useEffect(() => {
        async function fetchInfo() {
            setLoading(true);
            try {
                if (isMyProfile) {
                    setCurrentUser(user);

                    const userGames = await getAllGamesByUser();
                    const allGames = await getAllGames();
                    const friends = await getFriends();

                    setUserGames(userGames);
                    setAllGames(allGames);
                    setFriends(friends);
                } else {
                    const profileUser = await userInfoById({ id: userId });

                    setCurrentUser(profileUser);
                    setUserGames(profileUser.games);
                    setFriends([]);
                    setAllGames([]);
                }
            } catch (error) {
                console.error('Ошибка загрузки:', error);
            } finally {
                setLoading(false);
            }
        }

        if (user) {
            fetchInfo();
        }
    }, [user, userId]);



    // Заглушка на время загрузки
    if (loading) {
        return (
            <Loading />
        );
    }

    return (
        <LayoutWithNav>
            <div className="profile-page__container">
                <div className="profile-page__content">

                    <div className='profile-page__header'>
                        <img className='profile-page__image' src={getPathForImage(currentUser.bannerImage)} />

                        <div className='profile-page__user-info'>
                            <img className='profile-page__user-image' src={getPathForImage(currentUser.image)} />

                            <div className='profile-page__info'>
                                <div className='profile-page__username'>{currentUser?.name}</div>
                                <div className='profile-page__id'>#{currentUser?.id?.toString()}</div>
                            </div>

                            {isMyProfile && (
                                <button className='profile-page__edit-button' onClick={openEditMode}>
                                    <img src={SettingsIcon} className='profile-page__edit-button-image' />
                                    <span className='profile-page__edit-button-text' >
                                        Редактировать
                                    </span>
                                </button>
                            )}

                        </div>
                    </div>



                    <div className='profile-page__user-descr'>
                        Описание
                    </div >

                    <div className='profile-page__game-list'>
                        <h3 className='profile-page__sector-header'>Любимые игры:</h3>

                        {!userGames || userGames.length === 0 && !isMyProfile && (
                            <div className='profile-page__empty-list'>
                                У этого пользователя нет любимых игр
                            </div>
                        )}

                        <div className='profile-page__games-grid'>
                            {userGames.map(game => (
                                <GameCard
                                    key={game.name}
                                    game={game}
                                    onClick={() => openGameInfo(game)}
                                    onTrashClick={isMyProfile ? () => deleteGame(game.name) : undefined}
                                />
                            ))}

                            {isMyProfile &&
                                (<div className='profile-page__add-game' onClick={openGameList}>
                                    <img src={AddIcon} className='profile-page__add-game-icon' />
                                    Добавить
                                </div>)
                            }
                        </div>
                    </div>

                    {isMyProfile && (<div className='profile-page__friend-list'>
                        <h3 className='profile-page__sector-header'>Друзья:</h3>

                        {friends && friends.length > 0 ?
                            (
                                <div className='profile-page__friends-grid'>
                                    {friends.map(friend => (
                                        <UserCard
                                            user={friend}
                                        />
                                    ))}
                                </div>
                            )
                            : (
                                <div className='profile-page__empty-list'>
                                    У вас пока нет друзей
                                </div>
                            )}
                    </div>)}
                </div>

                <Modal isOpen={isEditMode} onClose={closeEditMode}>
                    <form onSubmit={updateUser} className='profile-page__form'>
                        <img src={CrossIcon} className='profile-page__form-cross' onClick={closeEditMode} />
                        <div className='profile-page__form-header'>Редактировать профиль</div>

                        <div className='profile-page__form-group'>
                            <label className='profile-page__label'>Описание</label>
                            <input
                                type='text'
                                name='descr'
                                className='profile-page__form-input'
                                placeholder='Введите описание'
                                value={userData.descr}
                                onChange={handleUserFormChange}
                                required
                            />
                        </div>
                        <div className='profile-page__form-buttons'>
                            <button
                                type='submit'
                                className='profile-page__form-button'
                                id='profile-page__form-submit'>
                                Сохранить
                            </button>
                            <button
                                type='button'
                                className='profile-page__form-button'
                                id='profile-page__form-cancel'
                                onClick={closeEditMode}>
                                Отмена
                            </button>
                        </div>
                    </form>
                </Modal>

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

                                {isMyProfile && (<button
                                    className='profile-page__game-modal-window-button'
                                    onClick={() => deleteGame(currentGame?.name)}>
                                    Удалить
                                </button>)}
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
                    {isMyProfile &&
                        (
                            <button className='profile-page__exit-button' onClick={handleLogout}>
                                Выйти
                            </button>
                        )
                    }

                </div>
            </div>
        </LayoutWithNav >
    );
}

export default ProfilePage;