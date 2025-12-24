import './styles/ProfilePage.css';
import LayoutWithNav from '../components/LayoutWithNav';
import { useAuth } from '../context/AuthContext';
import { getPathForImage } from '../utils/imageFormat';
import { useGame } from '../context/GameContext';
import { useEffect, useState } from 'react';

function ProfilePage() {
    const { user, logout } = useAuth();
    const { games, getGameList } = useGame();
    const [loading, setLoading] = useState(true);

    // Выход из аккаунта
    function handleLogout() {
        logout();
    };

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
                                    <div key={game.id} className='profile-page__game'>
                                        <img
                                            className='profile-page__game-image'
                                            src={getPathForImage(game.image)}
                                            alt={game.descr}
                                        />
                                        <div className='profile-page__game-name'>
                                            {game.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className='profile-page__no-games'>
                                Игры не добавлены
                            </div>
                        )}
                    </div>
                </div>

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