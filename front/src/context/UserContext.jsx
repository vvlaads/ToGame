import { createContext, useState, useContext, useEffect } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api.jsx';
import { deleteRequest, postRequest } from '../utils/requests.jsx'

const UserContext = createContext();

const REGISTER_URL = `${API_BASE_URL}${API_ENDPOINTS.REGISTER}`
const SIGN_IN_URL = `${API_BASE_URL}${API_ENDPOINTS.SIGN_IN}`
const INFO_URL = `${API_BASE_URL}${API_ENDPOINTS.USER_INFO}`
const INFO_BY_ID_URL = `${API_BASE_URL}${API_ENDPOINTS.USER_INFO_BY_ID}`
const UPDATE_AVATAR_URL = `${API_BASE_URL}${API_ENDPOINTS.UPDATE_AVATAR}`
const DELETE_AVATAR_URL = `${API_BASE_URL}${API_ENDPOINTS.DELETE_AVATAR}`
const SEND_LIKE_URL = `${API_BASE_URL}${API_ENDPOINTS.SEND_LIKE}`
const DELETE_FRIEND_URL = `${API_BASE_URL}${API_ENDPOINTS.DELETE_FRIEND}`
const GET_FRIENDS_URL = `${API_BASE_URL}${API_ENDPOINTS.GET_FRIENDS}`
const GET_RECIEVED_LIKES_URL = `${API_BASE_URL}${API_ENDPOINTS.GET_RECIEVED_LIKES}`
const GET_SENT_LIKES_URL = `${API_BASE_URL}${API_ENDPOINTS.GET_SENT_LIKES}`

function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function initUser() {
            try {
                // 1. Пытаемся восстановить из localStorage
                const savedUser = localStorage.getItem('user');
                if (savedUser) {
                    setUser(JSON.parse(savedUser));
                } else {
                    // 2. Или проверяем с бэка (если у тебя сессия / cookie)
                    const responseBody = await userInfo();
                    if (responseBody) {
                        setUser(responseBody);
                        localStorage.setItem('user', JSON.stringify(responseBody));
                    }
                }
            } catch (error) {
                console.error('Failed to init user', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        initUser();
    }, []);


    // Вспомогательный метод для входа/регистрации
    async function handleAuth(url, body) {
        try {
            await postRequest(url, body);       // Отправляем запрос на бэк
            const responseBody = await userInfo(); // Получаем инфо о пользователе
            setUser(responseBody);
            localStorage.setItem('user', JSON.stringify(responseBody));
            return true;
        } catch (error) {
            console.error('Auth failed', error);
            return false;
        }
    }

    // Регистрация пользователя
    async function register(userData) {
        const body = {
            name: userData.name,
            password: userData.password,
            games: userData.games
        };
        return handleAuth(REGISTER_URL, body);
    }

    // Авторизация пользователя
    async function signIn(userData) {
        const body = {
            name: userData.name,
            password: userData.password
        };
        return handleAuth(SIGN_IN_URL, body);
    }

    // Получение информации о пользователе
    async function userInfo() {
        try {
            const responseBody = await postRequest(INFO_URL);
            return responseBody[0];
        } catch (error) {
            console.error('User Info failed', error);
            return null;
        }
    }

    // Информация о пользователе с выбранным ID
    async function userInfoById(userId) {
        const responseBody = await postRequest(INFO_BY_ID_URL, userId);
        return responseBody[0];
    }

    // Обновление данных пользователя
    async function updateUser(newUser) {
        return await patchRequest(INFO_URL, newUser);
    }

    // Удаление пользователя
    async function deleteUser() {
        return await deleteRequest(INFO_URL);
    }

    // Обновление аватара
    async function updateAvatar(avatarId) {
        return await patchRequest(UPDATE_AVATAR_URL, { id: avatarId });
    }

    // Удаление аватара
    async function deleteAvatar() {
        return await deleteRequest(DELETE_AVATAR_URL);
    }

    // Отправка лайка пользователю
    async function sendLike(receiverId) {
        return await postRequest(SEND_LIKE_URL, { id: receiverId });
    }

    // Удаление друга
    async function deleteFriend(friendId) {
        return await deleteRequest(DELETE_FRIEND_URL, { id: friendId });
    }

    // Получение списка друзей
    async function getFriends() {
        return await postRequest(GET_FRIENDS_URL);
    }

    // Получение полученных лайков
    async function getReceivedLikes() {
        return await postRequest(GET_RECIEVED_LIKES_URL);
    }

    // Получение отправленных лайков
    async function getSentLikes() {
        return await postRequest(GET_SENT_LIKES_URL);
    }

    // Выход пользователя
    function logout() {
        setUser(null);
        localStorage.removeItem('user');
    };

    const value = {
        user,
        loading,
        signIn,
        register,
        logout,
        userInfoById,
        updateUser,
        deleteUser,
        updateAvatar,
        deleteAvatar,
        sendLike,
        deleteFriend,
        getFriends,
        getReceivedLikes,
        getSentLikes
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

function useUser() {
    return useContext(UserContext);
};

export { UserProvider, useUser };