import config from '../config/index.jsx'
import { createContext, useState, useContext } from 'react';
import { API_ENDPOINTS } from '../constants/api.jsx';
import { postRequest } from '../utils/requests.jsx'

const AuthContext = createContext();

const API_BASE_URL = config.apiUrl;
const REGISTER_URL = `${API_BASE_URL}${API_ENDPOINTS.REGISTER}`
const SIGN_IN_URL = `${API_BASE_URL}${API_ENDPOINTS.SIGN_IN}`
const INFO_URL = `${API_BASE_URL}${API_ENDPOINTS.USER_INFO}`

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // Регистрация пользователя
    async function register(userData) {
        const body = {
            name: userData.name,
            password: userData.password,
            games: []
        }

        try {
            await postRequest(REGISTER_URL, body);
            const responseBody = await userInfo();
            setUser(responseBody);
            localStorage.setItem('user', responseBody);
            return true;
        } catch (error) {
            console.error('Register failed', error);
            return false;
        }
    }

    // Авторизация пользователя
    async function signIn(userData) {
        const body = {
            name: userData.name,
            password: userData.password,
            games: []
        }

        try {
            await postRequest(SIGN_IN_URL, body);
            const responseBody = await userInfo();
            setUser(responseBody);
            localStorage.setItem('user', responseBody);
            return true;
        } catch (error) {
            console.error('Sign-In failed', error);
            return false;
        }
    };

    // Получение информации о пользователе
    async function userInfo() {
        try {
            const responseBody = await postRequest(INFO_URL);
            return responseBody;
        } catch (error) {
            console.error('User Info failed', error);
            return null;
        }
    }

    // Выход пользователя
    function logout() {
        setUser(null);
        localStorage.removeItem('user');
    };

    const value = { user, signIn, register, logout };

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