package to.game.rest.endpoints;

import java.util.HashMap;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArraySet;

import jakarta.inject.Inject;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import to.game.service.ChatManagmentService;

@ServerEndpoint("/ws/chat/{chatId}/{accessToken}")
public class MessageResource {
    @Inject
    ChatManagmentService chatManagmentService;

    private Session session;
    private static Set<MessageResource> chatEndpoints = new CopyOnWriteArraySet<>();
    private static HashMap<String, String> users = new HashMap<>();

    @OnOpen
    public void onOpen(Session session, @PathParam("accessToken") String accessToken) {
        this.session = session;
        chatEndpoints.add(this);
        users.put(session.getId(), accessToken);
    }

    @OnMessage
    public void onMessage(Session session, String message, @PathParam("chatId") String chatId,
            @PathParam("accessToken") String accessToken) {
        chatEndpoints.forEach(endpoint -> {
            synchronized (endpoint) {
                try {
                    endpoint.session.getBasicRemote().sendText(message);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
        chatManagmentService.sendMessage(UUID.fromString(accessToken), Long.parseLong(chatId), message);
    }

    @OnClose
    public void onClose(Session session) {
        chatEndpoints.remove(this);
        users.remove(session.getId());
    }

    @OnError
    public void onError(Session session, Throwable t) {
        // TODO: handle error
    }
}
