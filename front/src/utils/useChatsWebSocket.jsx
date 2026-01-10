import { useEffect, useRef } from "react";
import Cookies from 'js-cookie';

export function useChatWebSocket(chatId, onMessage) {
    const wsRef = useRef(null);

    useEffect(() => {
        if (!chatId) return;

        const token = Cookies.get('AccessToken');
        if (!token) return;

        const wsUrl = `ws://localhost:8080/ToGame-back-1.0-SNAPSHOT/ws/chat/${chatId}/${token}`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onmessage = (event) => {
            const message = event.data;
            onMessage?.(message);
        };

        return () => ws.close();
    }, [chatId]);

    const sendMessage = (message) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(message);
        }
    };

    return { sendMessage };
}
