import { createContext, useContext, useState } from "react";
import config from "../config";
import { USER_LIST } from "../constants/testValues";
import { useAuth } from "./AuthContext";

const SearchPlayersContext = createContext();

function SearchPlayersProvider({ children }) {
    const { user } = useAuth();
    const [players, setPlayers] = useState([]);

    async function findPlayers() {
        if (config.debug) {
            const players = USER_LIST.filter(u => u.id !== user.id);

            setPlayers(players);
            return { success: true, data: players }
        }

        //TODO: Обращение к серверу
        return { success: false, error: 'Ошибка получения рекомендуемых игроков' }
    }

    const value = { players, findPlayers };

    return (
        <SearchPlayersContext.Provider value={value}>
            {children}
        </SearchPlayersContext.Provider>
    );
}

function useSearchPlayers() {
    return useContext(SearchPlayersContext);
}

export { SearchPlayersProvider, useSearchPlayers };