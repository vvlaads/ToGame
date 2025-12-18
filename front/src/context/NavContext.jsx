import { createContext, useState, useContext } from 'react';

const NavContext = createContext();

export function NavProvider({ children }) {
    const [isNavHidden, setIsNavHidden] = useState(false);

    const toggleNav = () => {
        setIsNavHidden(prev => !prev);
    };

    const value = {
        isNavHidden,
        toggleNav,
        navWidth: isNavHidden ? 80 : 200 // Динамическая ширина
    };

    return (
        <NavContext.Provider value={value}>
            {children}
        </NavContext.Provider>
    );
}

export function useNav() {
    return useContext(NavContext);
}