package to.game.rest.endpoints;

import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;

@ServerEndpoint("/ws/signaling")
public class SignalingResource {
    @OnOpen
    public void onOpen(Session session){
        // TODO: handle open
    }

    @OnMessage
    public void onMessage(Session session, String message){
        // TODO: handle message
    }

    @OnClose
    public void onClose(Session session){
        // TODO: handle close
    }

    @OnError
    public void onError(Session session, Throwable t){
        // TODO: handle error
    }
}
