package to.game.rest.endpoints;

import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@ServerEndpoint("/ws/signaling/{roomId}")
public class SignalingResource {

    private static final Map<String, Set<Session>> rooms =
            new ConcurrentHashMap<>();

    @OnOpen
    public void onOpen(Session session, @PathParam("roomId") String roomId) {
        rooms
                .computeIfAbsent(roomId, r -> ConcurrentHashMap.newKeySet())
                .add(session);

        broadcast(roomId, """
            {"type":"user-joined"}
        """);
    }

    @OnClose
    public void onClose(Session session, @PathParam("roomId") String roomId) {
        Set<Session> room = rooms.get(roomId);
        if (room != null) {
            room.remove(session);

            broadcast(roomId, """
                {"type":"user-left"}
            """);

            if (room.isEmpty()) {
                rooms.remove(roomId);
            }
        }
    }

    @OnMessage
    public void onMessage(Session session, String message, @PathParam("roomId") String roomId) {
        broadcastExcept(roomId, session, message);
    }

    private void broadcast(String roomId, String msg) {
        Set<Session> room = rooms.get(roomId);
        if (room == null) return;

        for (Session s : room) {
            s.getAsyncRemote().sendText(msg);
        }
    }

    private void broadcastExcept(String roomId, Session except, String msg) {
        Set<Session> room = rooms.get(roomId);
        if (room == null) return;

        for (Session s : room) {
            if (!s.equals(except)) {
                s.getAsyncRemote().sendText(msg);
            }
        }
    }
}

