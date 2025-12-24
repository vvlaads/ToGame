import './styles/HomePage.css'
import ChatCard from '../components/ChatCard';
import LayoutWithNav from '../components/LayoutWithNav';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useChats } from '../context/ChatsContext';
import { useEffect, useState } from 'react';
import { useFriends } from '../context/FriendsContext';
import { getPathForImage } from '../utils/imageFormat';

function HomePage() {
    const { user } = useAuth();
    const { chats } = useChats();
    const { friends, getFriendList } = useFriends();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const activeChats = chats;

    // Переход к выбранному чату
    function redirectToChat(chatId) {
        navigate(`/chats?chatId=${chatId}`);
    }


    // Получаем друзей при загрузке компонента
    useEffect(() => {
        const fetchFriends = async () => {
            setLoading(true);
            try {
                await getFriendList();
            } catch (error) {
                console.error('Ошибка загрузки друзей:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchFriends();
        }
    }, [user]);

    if (loading) {
        return (
            <LayoutWithNav>
                <div className='home-page__container'>
                    <div className="loading">Загрузка...</div>
                </div>
            </LayoutWithNav>
        );
    }

    return (
        <LayoutWithNav>
            <div className='home-page__container'>
                <h1>С возвращением, {user?.name}!</h1>
                <div className='home-page__info'>
                    <div className='home-page__active-chats-container'>
                        <h2>Активные чаты:</h2>
                        <div className='home-page__active-chats-list'>
                            {activeChats.length > 0 ? (
                                activeChats.map((chat) => (
                                    <ChatCard
                                        key={chat.id}
                                        chat={chat}
                                        onClick={() => redirectToChat(chat.id)}
                                    />
                                ))
                            ) : (
                                <div className='home-page__no-active-chats'>
                                    Нет активных чатов за последний час
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='home-page__online-friends-container'>
                        <h2>Друзья в сети:</h2>
                        <div className='home-page__online-friends-list'>
                            {friends.map((friend) => (
                                <div key={friend.id} className='home-page__friend-info'>
                                    <img
                                        className='home-page__friend-avatar'
                                        src={getPathForImage(friend.image)}
                                        alt={friend.name}
                                    />
                                    <span className='home-page__friend-name'>
                                        {friend.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </LayoutWithNav>
    );
}

export default HomePage;