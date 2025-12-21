import './styles/HomePage.css'

import { useAuth } from '../context/AuthContext';
import LayoutWithNav from '../components/LayoutWithNav';
import ChatCard from '../components/ChatCard';
import { useNavigate } from 'react-router-dom';

function HomePage() {

    const { user } = useAuth();

    const navigate = useNavigate();

    const friends = [{
        id: 1,
        name: "vvlaads",
        avatar: "../../public/vite.svg"
    },
    {
        id: 2,
        name: "GamerPro",
        avatar: "../../public/vite.svg"
    }
    ];

    const chats = [
        {
            id: 1,
            name: 'Чат 1',
            avatar: "../../public/vite.svg",
            rooms: [],
            messages: [
                {
                    name: "vvlaads",
                    date: "20.12.2025",
                    time: "12:12",
                    message: "Привет!"
                },
                {
                    name: "vvlaads",
                    date: "20.12.2025",
                    time: "12:12",
                    message: "Привет!"
                },
                {
                    name: "vvlaads",
                    date: "20.12.2025",
                    time: "12:12",
                    message: "Всем привет!"
                }
            ]
        },
        {
            id: 2,
            name: 'Чат 2',
            avatar: "../../public/vite.svg",
            rooms: [
                {
                    id: 1,
                    name: "Болталка",
                    limit: 15,
                    players: [
                        {
                            name: "vvlaads",
                            avatar: "../../public/vite.svg"
                        },
                        {
                            name: "vvlaads",
                            avatar: "../../public/vite.svg"
                        },
                        {
                            name: "vvlaads",
                            avatar: "../../public/vite.svg"
                        },
                        {
                            name: "vvlaads",
                            avatar: "../../public/vite.svg"
                        }
                    ]
                },
                {
                    id: 2,
                    name: "CS:GO",
                    limit: 15,
                    players: [
                        {
                            name: "GamerPro",
                            avatar: "../../public/vite.svg"
                        },
                        {
                            name: "Capa",
                            avatar: "../../public/vite.svg"
                        }
                    ]
                }
            ],
            messages: [
                {
                    name: "GamerPro",
                    date: "20.12.2025",
                    time: "12:10",
                    message: "Привет!"
                },
                {
                    name: "vvlaads",
                    date: "20.12.2025",
                    time: "12:12",
                    message: "Привет!"
                },
                {
                    name: "GamerPro",
                    date: "20.12.2025",
                    time: "12:15",
                    message: "Го кс?"
                }
            ]
        },
        // ... остальные чаты
    ];

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
                            {chats.map((chat) => (
                                <ChatCard key={chat.id} chat={chat} onClick={() => redirectToChat(chat.id)} />
                            ))}
                        </div>
                    </div>

                    <div className='home-page__online-friends-container'>
                        <h2>Друзья в сети:</h2>
                        <div className='home-page__online-friends-list'>
                            {friends.map((friend) => (
                                <div className='home-page__friend-info'>
                                    <img className='home-page__friend-avatar' src={friend.avatar} />
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