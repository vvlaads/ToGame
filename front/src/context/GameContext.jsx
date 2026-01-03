import config from "../config";
import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { GAME_LIST, GAME_TO_USER, TAG_LIST, TAG_TO_GAME } from "../constants/testValues";

const GameContext = createContext();

function GameProvider({ children }) {
    const { user } = useAuth();
    const [games, setGames] = useState([]);
    const [tags, setTags] = useState([]);

    // Поиск игры по ID
    async function getGameById(gameId) {
        // Тестовые значения для дебага
        if (config.debug) {
            const findedGame = GAME_LIST.find(game => game.id === gameId);
            return { success: true, data: findedGame };
        }

        //TODO: обращение к серверу
        return { success: false, error: 'Не удалось загрузить игру' };
    }

    // Поиск тега по ID
    async function getTagById(tagId) {
        // Тестовые значения для дебага
        if (config.debug) {
            const findedTag = TAG_LIST.find(tag => tag.id === tagId);
            return { success: true, data: findedTag };
        }

        //TODO: обращение к серверу
        return { success: false, error: 'Не удалось загрузить тег' };
    }

    // Получить список игр для текущего пользователя
    async function getGameList() {
        const response = await findGamesForUser(user.id);
        if (response.success) {
            setGames(response.data);
            return response;
        }
        return { success: false, error: response.error };
    }

    // Получить список тегов для текущего пользователя
    async function getTagList() {
        const response = await findTagsForUser(user.id);
        if (response.success) {
            setTags(response.data);
            return response;
        }
        return { success: false, error: response.error };
    }

    // Найти игры для пользователя
    async function findGamesForUser(userId) {
        // Тестовые значения для дебага
        if (config.debug) {
            try {
                const gamePromises = [];
                GAME_TO_USER.forEach(pair => {
                    if (pair.userId === userId) {
                        gamePromises.push(getGameById(pair.gameId));
                    }
                });

                // Ждем завершения всех промисов
                const gameResponses = await Promise.all(gamePromises);

                // Извлекаем только успешные результаты с данными
                const gamesData = gameResponses
                    .filter(response => response.success && response.data)
                    .map(response => response.data);

                return { success: true, data: gamesData };
            } catch (error) {
                console.error('Ошибка загрузки игр:', error);
                return { success: false, error: error.message };
            }
        }

        //TODO: обращение к серверу
        return { success: false, error: 'Не удалось загрузить список игр' };
    }

    // Найти теги для пользователя
    async function findTagsForUser(userId) {
        if (config.debug) {
            try {
                // Сначала получаем игры пользователя
                const gamesResponse = await findGamesForUser(userId);
                if (!gamesResponse.success) {
                    return { success: false, error: gamesResponse.error };
                }

                const games = gamesResponse.data || [];
                if (games.length === 0) {
                    return { success: true, data: [] };
                }

                // Собираем ID игр
                const gameIds = games.map(game => game.id);

                // Находим теги, связанные с этими играми
                const tagPromises = new Set();
                TAG_TO_GAME.forEach(pair => {
                    if (gameIds.includes(pair.gameId)) {
                        tagPromises.add(getTagById(pair.tagId));
                    }
                });

                // Ждем завершения всех промисов
                const tagResponses = await Promise.all(Array.from(tagPromises));

                // Извлекаем только успешные результаты с данными
                const tagsData = tagResponses
                    .filter(response => response.success && response.data)
                    .map(response => response.data);

                // Убираем дубликаты по ID
                const uniqueTags = Array.from(
                    new Map(tagsData.map(tag => [tag.id, tag])).values()
                );

                return { success: true, data: uniqueTags };
            } catch (error) {
                console.error('Ошибка загрузки тегов:', error);
                return { success: false, error: error.message };
            }
        }

        //TODO: обращение к серверу
        return { success: false, error: 'Не удалось загрузить список тегов' };
    }

    async function findTagsForGame(gameId) {
        const pairs = TAG_TO_GAME.filter(pair => pair.gameId === gameId);
        let tags = [];
        pairs.forEach(async pair => {
            let response = await getTagById(pair.tagId);
            if (response.success) {
                tags.push(response.data);
            }
        })
        return tags;
    }

    async function deleteGameForUser(gameId) {
        console.log(`Удаление игры с id: ${gameId}, userId: ${user.id}, `);
        //TODO: Обращение на сервер
    }

    const value = {
        games,
        tags,
        getGameList,
        getTagList,
        findGamesForUser,
        findTagsForUser,
        findTagsForGame,
        deleteGameForUser
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