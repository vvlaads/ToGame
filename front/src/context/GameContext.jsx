import config from "../config";
import { createContext, useContext, useState } from "react";
import { API_ENDPOINTS } from "../constants/api";
import { postRequest } from "../utils/requests";

const GameContext = createContext();

const API_BASE_URL = config.apiUrl;
const GAME_ALL_URL = `${API_BASE_URL}${API_ENDPOINTS.GAME_ALL}`

function GameProvider({ children }) {
    const [games, setGames] = useState([]);

    //Получить список всех игр
    async function getAllGames() {
        const responseBody = await postRequest(GAME_ALL_URL);
        console.log(responseBody);
        return responseBody;
    }

    const value = {
        games,
        getAllGames
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
}

function useGame() {
    return useContext(GameContext);
}

export { GameProvider, useGame };