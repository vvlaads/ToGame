import config from '../config/index.jsx'
import { createContext, useState, useContext } from 'react';
import { API_ENDPOINTS } from '../constants/api.jsx';
import { AUTH_TYPE } from '../constants/enums.jsx';
import { USER_LIST } from '../constants/testValues.jsx';

const AuthContext = createContext();

const API_BASE_URL = config.apiUrl;
const API_REGISTER_URL = `${API_BASE_URL}${API_ENDPOINTS.REGISTER}`
const API_SIGN_UP_URL = `${API_BASE_URL}${API_ENDPOINTS.SIGN_UP}`

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // Отправка запроса с данными пользователя
    async function sendUserData(userData, requestType) {
        // Для дебага имитируем обращение к серверу
        if (config.debug) {
            const user = USER_LIST[0];
            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));
            return { success: true, data: user };
        }

        // Основное тело метода
        var url = ''
        var errorMessage = ''
        switch (requestType) {
            case AUTH_TYPE.REGISTER:
                url = API_REGISTER_URL;
                errorMessage = 'Ошибка регистрации';
                break;
            case AUTH_TYPE.SIGN_UP:
                url = API_SIGN_UP_URL;
                errorMessage = 'Ошибка авторизации';
                break;
            default:
                return { success: false, error: 'Неверный тип запроса' }
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: userData.name,
                    password: userData.password
                })
            });

            if (!response.ok) {
                throw new Error(errorMessage);
            }

            const data = await response.json();

            const user = {
                id: data?.id,
                name: data?.name,
                password: data?.password,
                avatarId: data?.avatarId,
                descr: data?.descr,
                roomId: data?.roomId,
                image: data?.image,
                bannerImage: data?.bannerImage
            };

            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));
            return { success: true, data: user };

        } catch (error) {
            console.error(errorMessage, error);
            return { success: false, error: error.message };
        }
    }

    // Регистрация пользователя
    async function signUp(userData) {
        return sendUserData(userData, AUTH_TYPE.REGISTER);
    }

    // Авторизация пользователя
    async function signIn(userData) {
        return sendUserData(userData, AUTH_TYPE.SIGN_UP);
    };

    // Выход пользователя
    function logout() {
        setUser(null);
        localStorage.removeItem('user');
    };

    const value = { user, signIn, signUp, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

function useAuth() {
    return useContext(AuthContext);
};

export { AuthProvider, useAuth };