import config from '../config/index.js'
import { createContext, useState, useContext } from 'react';
import { API_ENDPOINTS, UserRequestType } from '../constants/api.js';
import { GAME_LIST } from '../constants/testValues.js';

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
            const user = {
                id: 100,
                username: userData.login,
                password: userData.password,
                games: GAME_LIST
            };
            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));
            return { success: true, data: user };
        }

        // Основное тело метода
        var url = ''
        var errorMessage = ''
        switch (requestType) {
            case UserRequestType.REGISTER:
                url = API_REGISTER_URL;
                errorMessage = 'Ошибка регистрации';
                break;
            case UserRequestType.SIGN_UP:
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
                    username: userData.login,
                    password: userData.password
                })
            });

            if (!response.ok) {
                throw new Error(errorMessage);
            }

            const data = await response.json();

            const user = {
                id: data?.id,
                username: data?.login,
                password: data?.password,
                games: data?.games
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
    async function register(userData) {
        return sendUserData(userData, UserRequestType.REGISTER);
    }

    // Авторизация пользователя
    async function signUp(userData) {
        return sendUserData(userData, UserRequestType.SIGN_UP);
    };

    // Выход пользователя
    function logout() {
        setUser(null);
        localStorage.removeItem('user');
    };

    const value = { user, register, signUp, logout };

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