import './styles/SearchPlayersPage.css';
import LayoutWithNav from '../components/LayoutWithNav';
import { useEffect, useState } from 'react';
import LeftArrow from '../assets/icons/left arrow.svg';
import RightArrow from '../assets/icons/right arrow.svg';
import { useChats } from '../context/ChatsContext';
import { useNavigate } from 'react-router-dom';
import { useSearchPlayers } from '../context/SearchPlayersContext';
import { useAuth } from '../context/AuthContext';
import { getPathForImage } from '../utils/pathFormat';
import { useGame } from '../context/GameContext';

function SearchPlayersPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { chats, addChat } = useChats();
    const { players, findPlayers } = useSearchPlayers();
    const { findGamesForUser, findTagsForUser } = useGame();
    const [loading, setLoading] = useState(true);
    const [curPos, setCurPos] = useState(0);
    const [currentTags, setCurrentTags] = useState([]);
    const [currentGames, setCurrentGames] = useState([]);
    const [loadingTagsGames, setLoadingTagsGames] = useState(false);

    // Перейти к предыдущему игроку
    function prevUser() {
        setCurPos(curPos - 1 < 0 ? players.length - 1 : curPos - 1);
    }

    // Перейти к следующему игроку
    function nextUser() {
        setCurPos(curPos + 1 > players.length - 1 ? 0 : curPos + 1);
    }

    // Перейти в чат с игроком
    function chatToPerson() {
        const existingChat = chats.find(chat => chat.name === players[curPos].name);

        if (existingChat) {
            navigate(`/chats?chatId=${existingChat.id}`);
            return;
        }

        const newChatId = addChat({
            name: players[curPos].name,
            image: "../../public/vite.svg",
        });

        navigate(`/chats?chatId=${newChatId}`);
    }

    // Загрузка тегов и игр для текущего игрока
    useEffect(() => {
        const loadTagsAndGames = async () => {
            if (players.length === 0 || !players[curPos]) return;

            setLoadingTagsGames(true);
            try {
                const user = players[curPos];

                // Загружаем параллельно
                const [tagsResponse, gamesResponse] = await Promise.all([
                    findTagsForUser(user.id),
                    findGamesForUser(user.id)
                ]);

                if (tagsResponse.success) {
                    setCurrentTags(tagsResponse.data || []);
                } else {
                    setCurrentTags([]);
                    console.error('Ошибка загрузки тегов:', tagsResponse.error);
                }

                if (gamesResponse.success) {
                    setCurrentGames(gamesResponse.data || []);
                } else {
                    setCurrentGames([]);
                    console.error('Ошибка загрузки игр:', gamesResponse.error);
                }
            } catch (error) {
                console.error('Ошибка загрузки данных игрока:', error);
                setCurrentTags([]);
                setCurrentGames([]);
            } finally {
                setLoadingTagsGames(false);
            }
        };

        loadTagsAndGames();
    }, [curPos, players, findTagsForUser, findGamesForUser]);

    // Получаем игроков при загрузке компонента
    useEffect(() => {
        const fetchPlayers = async () => {
            setLoading(true);
            try {
                await findPlayers();
            } catch (error) {
                console.error('Ошибка поиска игроков:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchPlayers();
        }
    }, [user]);

    if (loading) {
        return (
            <LayoutWithNav>
                <div className='search-players-page__container'>
                    <div className="loading">Загрузка...</div>
                </div>
            </LayoutWithNav>
        );
    }

    if (players.length === 0) {
        return (
            <LayoutWithNav>
                <div className='search-players-page__container'>
                    <div className="no-players">Игроки не найдены</div>
                </div>
            </LayoutWithNav>
        );
    }

    const currentPlayer = players[curPos];

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
                        <img
                            className='search-players-page__banner_image'
                            src={getPathForImage(currentPlayer.bannerImage)}
                            alt="Баннер"
                        />

                        <div className='search-players-page__image_and_name'>
                            <img
                                className='search-players-page__image'
                                src={getPathForImage(currentPlayer.image)}
                                alt={currentPlayer.name}
                            />
                            <div className='search-players-page__name'>{currentPlayer.name}</div>
                        </div>

                        <div className='search-players-page__descr'>{currentPlayer.descr}</div>

                        <div className='search-players-page__section'>
                            <div className='search-players-page__label'>ТЕГИ:</div>
                            {loadingTagsGames ? (
                                <div className="loading-small">Загрузка тегов...</div>
                            ) : (
                                <div className='search-players-page__tags'>
                                    {currentTags.length > 0 ? (
                                        currentTags.map(tag => (
                                            <div key={tag.id} className='search-players-page__tag'>
                                                {tag.name}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-data">Теги не указаны</div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className='search-players-page__section'>
                            <div className='search-players-page__label'>ИГРАЕТ В:</div>
                            {loadingTagsGames ? (
                                <div className="loading-small">Загрузка игр...</div>
                            ) : (
                                <div className='search-players-page__games'>
                                    {currentGames.length > 0 ? (
                                        currentGames.map(game => (
                                            <div key={game.id} className='search-players-page__game'>
                                                {game.name}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-data">Игры не указаны</div>
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            className='search-players-page__success-button'
                            onClick={chatToPerson}>
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