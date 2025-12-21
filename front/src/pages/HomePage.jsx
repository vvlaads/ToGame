import './styles/HomePage.css'
import { useAuth } from '../context/AuthContext';
import LayoutWithNav from '../components/LayoutWithNav';
import ChatCard from '../components/ChatCard';
import { useNavigate } from 'react-router-dom';
import { useChats } from '../context/ChatsContext';
import {
    sortChatsByLastMessage,
    getRecentChats
} from '../utils/chatUtils';
import { useMemo } from 'react';

function HomePage() {
    const { user } = useAuth();
    const { chats } = useChats();
    const navigate = useNavigate();

    // Получаем и сортируем активные чаты (последнее сообщение в течение часа)
    const activeChats = useMemo(() => {
        // Фильтруем чаты с последним сообщением в течение часа
        const recentChats = getRecentChats(chats, 1);

        // Сортируем по времени последнего сообщения (новые первыми)
        return sortChatsByLastMessage(recentChats);
    }, [chats]);

    // Можно также получить все чаты для отладки
    const allSortedChats = useMemo(() => sortChatsByLastMessage(chats), [chats]);

    const friends = [{
        id: 1,
        name: "vvlaads",
        avatar: "../../public/vite.svg"
    },
    {
        id: 2,
        name: "GamerPro",
        avatar: "../../public/vite.svg"
    }];

    function redirectToChat(chatId) {
        console.log('navigate to chats')
        navigate(`/chats?chatId=${chatId}`);
    }

    return (
        <LayoutWithNav>
            <div className='home-page__container'>
                <h1>С возвращением, {user?.username}!</h1>
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
                                        src={friend.avatar}
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