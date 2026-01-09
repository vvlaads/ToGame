import './styles/SearchPlayersPage.css';
import LayoutWithNav from '../components/LayoutWithNav';
import LeftArrow from '../assets/icons/left arrow.svg';
import RightArrow from '../assets/icons/right arrow.svg';
import { getPathForAvatar, getPathForBanner } from '../utils/pathFormat';
import { useEffect, useState } from 'react';
import Tag from '../components/Tag';
import { useUser } from '../context/UserContext';
import Loading from '../components/Loading';

function SearchPlayersPage() {
    const [recUsers, setRecUsers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);
    const [games, setGames] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const { userInfoById, sendLike, getRecommendedFriends } = useUser()

    // Константы для ограничения отображения
    const MAX_VISIBLE_TAGS = 6;
    const MAX_VISIBLE_GAMES = 6;

    // Следующий пользователь
    function nextUser() {
        if (currentIndex + 1 < recUsers.length) {
            setCurrentIndex(i => i + 1);
        }
    }

    // Предыдущий пользователь
    function prevUser() {
        if (currentIndex > 0) {
            setCurrentIndex(i => i - 1);
        }
    }

    // Отправить лайк пользователю
    function handleLikeButton() {
        sendLike(currentUser.id);
        setRecUsers(prev => {
            const newList = prev.filter(
                (_, index) => index !== currentIndex
            );

            // если мы были на последнем — сдвигаем индекс влево
            if (currentIndex >= newList.length && newList.length > 0) {
                setCurrentIndex(newList.length - 1);
            }

            return newList;
        });
    }

    // Загрузка рекомендуемых пользователей
    useEffect(() => {
        async function fetchRecommendations() {
            try {
                setLoading(true);
                const recommendedFriends = await getRecommendedFriends();
                setRecUsers(recommendedFriends);
            } catch (error) {
                console.error('Ошибка загрузки рекомендуемых пользователей', error);
            } finally {
                setLoading(false);
            }
        }

        fetchRecommendations();
    }, [])

    // Обновление текущего пользователя при изменении индекса или списка
    useEffect(() => {
        const user = recUsers[currentIndex];
        if (!user) return;

        setCurrentUser(user);
        setGames(user.games ?? []);

        const uniqueTags = [];
        const names = new Set();

        user.games?.forEach(game => {
            game.tags?.forEach(tag => {
                if (tag?.name && !names.has(tag.name)) {
                    names.add(tag.name);
                    uniqueTags.push(tag);
                }
            });
        });

        setTags(uniqueTags);
    }, [currentIndex, recUsers]);



    // Рассчитываем количество скрытых элементов
    const hiddenTagsCount = Math.max(0, tags.length - MAX_VISIBLE_TAGS);
    const hiddenGamesCount = Math.max(0, games.length - MAX_VISIBLE_GAMES);

    // Получаем только видимые элементы
    const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS);
    const visibleGames = games.slice(0, MAX_VISIBLE_GAMES);

    if (loading) {
        return <Loading />
    }

    return (
        <LayoutWithNav>
            <div className='search-players-page__container'>
                {recUsers.length === 0 ?
                    (
                        <div className="search-players-page__empty">
                            Пользователей больше нет
                        </div>
                    )
                    : (
                        <div className='search-players-page__card'>
                            <div className='search-players-page__button-container'>
                                <button
                                    onClick={prevUser}
                                    className='search-players-page__button search-players-page__button--prev'
                                    disabled={currentIndex === 0}>
                                    <img src={LeftArrow} className='search-players-page___icon' />
                                </button>
                            </div>

                            <div className='search-players-page__info'>
                                <img
                                    className='search-players-page__banner_image'
                                    src={getPathForBanner(currentUser?.avatar?.bannerFilePath)}
                                />

                                <div className='search-players-page__image_and_name'>
                                    <img
                                        className='search-players-page__image'
                                        src={getPathForAvatar(currentUser?.avatar?.filepath)}
                                    />
                                    <div className='search-players-page__name'>{currentUser?.name}</div>
                                </div>

                                <div className='search-players-page__descr'>{currentUser?.descr}</div>

                                <div className='search-players-page__section'>
                                    <div className='search-players-page__label'>ТЕГИ:</div>
                                    <div className='search-players-page__tags'>
                                        {visibleTags.map(tag =>
                                            <Tag
                                                key={tag.name}
                                                tag={tag}
                                            />)}
                                    </div>
                                    {hiddenTagsCount > 0 && (<div className='search-players-page__hidden-count'>+ {hiddenTagsCount} тегов</div>)}
                                </div>

                                <div className='search-players-page__section'>
                                    <div className='search-players-page__label'>ИГРАЕТ В:</div>
                                    <div className='search-players-page__games'>
                                        {visibleGames.map(game =>
                                            <div
                                                key={game.name}
                                                className='search-players-page__game'>
                                                {game.name}
                                            </div>
                                        )}
                                    </div>
                                    {hiddenGamesCount > 0 && (<div className='search-players-page__hidden-count'>+ {hiddenGamesCount} игры</div>)}
                                </div>

                                <button
                                    className='search-players-page__like-button'
                                    onClick={handleLikeButton}>
                                    Лайк
                                </button>
                            </div>

                            <div className='search-players-page__button-container'>
                                <button onClick={nextUser} className='search-players-page__button search-players-page__button--next'>
                                    <img src={RightArrow} className='search-players-page___icon' />
                                </button>
                            </div>
                        </div>
                    )}
            </div>
        </LayoutWithNav>
    );
}

export default SearchPlayersPage;