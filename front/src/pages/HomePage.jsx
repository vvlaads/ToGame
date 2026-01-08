import './styles/HomePage.css'
import { useUser } from '../context/UserContext';
import { useEffect, useState } from 'react';
import UserCard from '../components/UserCard';
import ChatCard from '../components/ChatCard';
import LayoutWithNav from '../components/LayoutWithNav';

function HomePage() {
    const [friends, setFriends] = useState([]);
    const [chats, setChats] = useState([]);
    const { user, userInfo, getFriends } = useUser();


    // Загрузка друзей и чатов
    useEffect(() => {
        async function fetchFriends() {
            const response = await getFriends();
            setFriends(response);
        }

        async function fetchChats() {
            const response = await userInfo();
            setChats(response.chats);
        }

        fetchChats();
        fetchFriends();
    }, [user])

    return (
        <LayoutWithNav>
            <div className='home-page__container'>
                <h1>С возвращением, {user?.name}!</h1>

                <div className='home-page__info'>
                    <div className='home-page__active-chats-container'>
                        <h2>Чаты:</h2>
                        {chats && chats.length > 0 ?
                            (
                                <div className='home-page__active-chats-list'>
                                    {chats.map(chat => (
                                        <ChatCard
                                            key={chat.id}
                                            chat={chat}
                                        />
                                    ))}
                                </div>
                            ) :
                            (
                                <div className='home-page__empty-list'>
                                    У вас пока нет чатов
                                </div>
                            )}
                    </div>

                    <div className='home-page__online-friends-container'>
                        <h2>Друзья:</h2>
                        {friends && friends.length > 0 ?
                            (
                                <div className='home-page__online-friends-list'>
                                    {friends.map(friend => (
                                        <UserCard
                                            key={friend.id}
                                            user={friend}
                                        />
                                    ))}
                                </div>
                            ) :
                            (
                                <div className='home-page__empty-list'>
                                    У вас пока нет друзей
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </LayoutWithNav>
    );
}

export default HomePage;