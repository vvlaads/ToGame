import config from "../config";
import { createContext, useContext } from "react";
import { API_ENDPOINTS } from "../constants/api";
import { deleteRequest, postRequest } from "../utils/requests";

const GameContext = createContext();

const API_BASE_URL = config.apiUrl;
const GAME_ALL_URL = `${API_BASE_URL}${API_ENDPOINTS.GAME_ALL}`
const GAME_ALL_BY_USER_URL = `${API_BASE_URL}${API_ENDPOINTS.GAME_ALL_BY_USER}`
const ADD_GAME_URL = `${API_BASE_URL}${API_ENDPOINTS.ADD_GAME}`
const REMOVE_GAME_URL = `${API_BASE_URL}${API_ENDPOINTS.REMOVE_GAME}`

function GameProvider({ children }) {

    // Получить список всех игр
    async function getAllGames() {
        const responseBody = await postRequest(GAME_ALL_URL);
        return responseBody;
    }

    // Получить список игр пользователя
    async function getAllGamesByUser() {
        const responseBody = await postRequest(GAME_ALL_BY_USER_URL);
        return responseBody;
    }

    // Добавить игру в список пользователя
    async function addGame(game) {
        const responseBody = await postRequest(ADD_GAME_URL, game);
        return responseBody;
    }

    // Удалить игру из списка пользователя
    async function removeGame(game) {
        const responseBody = await deleteRequest(REMOVE_GAME_URL, game);
        return responseBody;
    }

    const value = {
        getAllGames,
        getAllGamesByUser,
        addGame,
        removeGame
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