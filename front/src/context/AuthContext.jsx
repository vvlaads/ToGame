import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);


    function login(userData) {
        const newUser = {
            username: userData.login,
            password: userData.password
        };

        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);

        return { success: true };
    };

    function logout() {
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = { user, login, logout };

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