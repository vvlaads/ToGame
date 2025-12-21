import { createContext, useState, useContext } from 'react';
import ApexAvatar from "../assets/Apex.jpg"

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const games = [
        {
            id: 1,
            name: "Apex Legends",
            avatar: ApexAvatar
        },
        {
            id: 2,
            name: "CS:GO",
            avatar: ApexAvatar
        },
        {
            id: 3,
            name: "Dota 2",
            avatar: ApexAvatar
        }
    ]

    function register(userData) {
        const newUser = {
            username: userData.login,
            password: userData.password,
            games: games
        };

        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);

        return { success: true };
    }

    function login(userData) {
        const newUser = {
            username: userData.login,
            password: userData.password,
            games: games
        };

        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);

        return { success: true };
    };

    function logout() {
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = { user, register, login, logout };

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