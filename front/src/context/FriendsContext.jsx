import config from "../config";
import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { API_ENDPOINTS } from "../constants/api";
import { FRIEND_LIST, USER_LIST } from "../constants/testValues";

const FriendsContext = createContext();

const API_BASE_URL = config.apiUrl;
const API_FRIENDS_URL = `${API_BASE_URL}${API_ENDPOINTS.FRIENDS}`;

function FriendsProvider({ children }) {
    const { user } = useAuth();
    const [friends, setFriends] = useState([]);

    // Получение информации о пользователе (кроме пароля)
    async function getUserInfo(userId) {
        // В дебаге используем тестовые значения
        if (config.debug) {
            const user = USER_LIST.find(u => u.id === userId);
            if (user) {
                return {
                    id: user.id,
                    name: user.name,
                    avatarId: user.avatarId,
                    descr: user.descr,
                    roomId: user.roomId,
                    image: user.image,
                    bannerImage: user.bannerImage
                };
            }
            return null;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Ошибка получения информации о пользователе');
            }

            const userData = await response.json();
            return userData;
        } catch (error) {
            console.error('Ошибка получения информации о пользователе:', error);
            return null;
        }
    }

    // Получение списка друзей текущего пользователя
    async function getFriendList() {
        if (!user) {
            return { success: false, error: 'Не найден пользователь' };
        }

        // В дебаге используем тестовые значения
        if (config.debug) {
            const friendList = FRIEND_LIST;
            const friendPromises = [];

            friendList.forEach(pair => {
                if (pair.user1Id === user.id) {
                    friendPromises.push(getUserInfo(pair.user2Id));
                } else if (pair.user2Id === user.id) {
                    friendPromises.push(getUserInfo(pair.user1Id));
                }
            });

            // Ждем завершения всех промисов
            const friends = await Promise.all(friendPromises);

            // Фильтруем null значения (если пользователь не найден)
            const validFriends = friends.filter(friend => friend !== null);

            setFriends(validFriends);
            return { success: true, data: validFriends };
        }

        // Основной метод
        try {
            const response = await fetch(`${API_FRIENDS_URL}/${user.id}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Ошибка получения списка друзей');
            }

            const data = await response.json();
            setFriends(data);
            return { success: true, data: data };

        } catch (error) {
            console.error('Ошибка получения списка друзей:', error);
            return { success: false, error: error.message };
        }
    }

    const value = { friends, getFriendList, getUserInfo };

    return (
        <FriendsContext.Provider value={value}>
            {children}
        </FriendsContext.Provider>
    );
}

function useFriends() {
    return useContext(FriendsContext);
}

export { FriendsProvider, useFriends };