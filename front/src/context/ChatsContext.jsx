import { createContext, useContext } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api.jsx';
import { deleteRequest, patchRequest, postRequest } from '../utils/requests.jsx';

const ChatsContext = createContext();

const CREATE_CHAT_URL = `${API_BASE_URL}${API_ENDPOINTS.CREATE_CHAT}`;
const UPDATE_CHAT_URL = `${API_BASE_URL}${API_ENDPOINTS.UPDATE_CHAT}`;
const DELETE_CHAT_URL = `${API_BASE_URL}${API_ENDPOINTS.DELETE_CHAT}`;
const JOIN_CHAT_URL = `${API_BASE_URL}${API_ENDPOINTS.JOIN_CHAT}`;
const LEAVE_CHAT_URL = `${API_BASE_URL}${API_ENDPOINTS.LEAVE_CHAT}`;
const JOIN_ROOM_URL = `${API_BASE_URL}${API_ENDPOINTS.JOIN_ROOM}`;
const LEAVE_ROOM_URL = `${API_BASE_URL}${API_ENDPOINTS.LEAVE_ROOM}`;
const CREATE_ROOM_URL = `${API_BASE_URL}${API_ENDPOINTS.CREATE_ROOM}`;
const DELETE_ROOM_URL = `${API_BASE_URL}${API_ENDPOINTS.DELETE_ROOM}`;
const SEND_MESSAGE_URL = `${API_BASE_URL}${API_ENDPOINTS.SEND_MESSAGE}`;
const GET_MESSAGES_URL = `${API_BASE_URL}${API_ENDPOINTS.GET_MESSAGES}`;
const GET_USERS_URL = `${API_BASE_URL}${API_ENDPOINTS.CHAT_GET_USERS}`;
const GET_ROOMS_URL = `${API_BASE_URL}${API_ENDPOINTS.GET_ROOMS}`;
const GET_USERS_IN_ROOM_URL = `${API_BASE_URL}${API_ENDPOINTS.GET_USERS_IN_ROOM}`;

function ChatsProvider({ children }) {

    // Создание чата
    async function createChat(chat) {
        return await postRequest(CREATE_CHAT_URL, chat);
    }

    // Обновление чата
    async function updateChat(chat) {
        return await patchRequest(UPDATE_CHAT_URL, chat);
    }

    // Удаление чата
    async function deleteChat(chat) {
        return await deleteRequest(DELETE_CHAT_URL, chat);
    }

    // Присоединиться к чату
    async function joinChat(chat) {
        return await postRequest(JOIN_CHAT_URL, chat);
    }

    // Покинуть чат
    async function leaveChat(chat) {
        return await deleteRequest(LEAVE_CHAT_URL, chat);
    }

    // Присоединиться к комнате
    async function joinRoom(room) {
        return await postRequest(JOIN_ROOM_URL, room);
    }

    // Покинуть комнату
    async function leaveRoom(room) {
        return await deleteRequest(LEAVE_ROOM_URL, room);
    }

    // Создать комнату
    async function createRoom(room) {
        return await postRequest(CREATE_ROOM_URL, room);
    }

    // Удалить комнату
    async function deleteRoom(room) {
        return await deleteRequest(DELETE_ROOM_URL, room);
    }

    // Отправить сообщение
    async function sendMessage(message) {
        return await postRequest(SEND_MESSAGE_URL, message);
    }

    // Получить сообщения
    async function getMessages(chat) {
        return await postRequest(GET_MESSAGES_URL, chat);
    }

    // Получить список пользователей чата
    async function getChatUsers(chat) {
        return await postRequest(GET_USERS_URL, chat);
    }

    // Получение списка комнат
    async function getRooms(chat) {
        return await postRequest(GET_ROOMS_URL, chat);
    }

    // Получение списка участников комнаты
    async function getUsersInRoom(room) {
        return await postRequest(GET_USERS_IN_ROOM_URL, room);
    }

    const value = {
        createChat,
        updateChat,
        deleteChat,
        joinChat,
        leaveChat,
        joinRoom,
        leaveRoom,
        createRoom,
        deleteRoom,
        sendMessage,
        getMessages,
        getChatUsers,
        getRooms,
        getUsersInRoom
    };

    return (
        <ChatsContext.Provider value={value}>
            {children}
        </ChatsContext.Provider>
    );
}

function useChats() {
    return useContext(ChatsContext);
}


export { ChatsProvider, useChats };