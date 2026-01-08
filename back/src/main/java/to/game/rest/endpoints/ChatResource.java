package to.game.rest.endpoints;

import java.util.UUID;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.CookieParam;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import to.game.model.dto.ChatDTO;
import to.game.model.dto.MessageDTO;
import to.game.model.dto.ResponseDTO;
import to.game.model.dto.RoomDTO;
import to.game.model.dto.UserDTO;
import to.game.service.ChatManagmentService;
import to.game.service.UserService;

@Path("/chat")
public class ChatResource {
    @Inject
    ChatManagmentService chatManagmentService;

    @Inject
    UserService userService;

    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response create(@CookieParam("AccessToken") String token, ChatDTO chat) {
        ResponseDTO<Object> resp = chatManagmentService.createChat(UUID.fromString(token), chat.getName(),
                chat.getDescr(), chat.getFilepath());
        return Response.status(resp.getStatus()).build();
    }

    @Path("/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @PATCH
    @Transactional
    public Response update(@CookieParam("AccessToken") String token, ChatDTO chat) {
        chatManagmentService.renameChat(chat.getId(), UUID.fromString(token), chat.getName());
        chatManagmentService.changeFilepath(chat.getId(), UUID.fromString(token), chat.getFilepath());
        ResponseDTO<Object> resp = chatManagmentService.changeDescr(chat.getId(), UUID.fromString(token),
                chat.getDescr());
        return Response.status(resp.getStatus()).build();
    }

    @Path("/delete")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @DELETE
    public Response delete(@CookieParam("AccessToken") String token, ChatDTO chat) {
        ResponseDTO<Object> resp = chatManagmentService.deleteChat(chat.getId(), UUID.fromString(token));
        return Response.status(resp.getStatus()).build();
    }

    @Path("/join-chat")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response joinChat(@CookieParam("AccessToken") String token, ChatDTO chat) {
        ResponseDTO<Object> resp = userService.joinChat(UUID.fromString(token), chat.getId());
        return Response.status(resp.getStatus()).build();
    }

    @Path("/add-users")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    @Transactional
    public Response addUsers(@CookieParam("AccessToken") String token, ChatDTO chat){
        chat.getUsers().stream().forEach(u -> chatManagmentService.addUser(chat.getId(), u.getId()));
        return Response.ok().build();
    }

    @Path("/leave-chat")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @DELETE
    public Response leaveChat(@CookieParam("AccessToken") String token, ChatDTO chat) {
        ResponseDTO<Object> resp = userService.leaveChat(UUID.fromString(token), chat.getId());
        return Response.status(resp.getStatus()).build();
    }

    @Path("/join-room")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response joinRoom(@CookieParam("AccessToken") String token, RoomDTO room) {
        ResponseDTO<Object> resp = userService.joinRoom(UUID.fromString(token), room.getChatId(), room.getId());
        return Response.status(resp.getStatus()).build();
    }

    @Path("/leave-room")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @DELETE
    public Response leaveRoom(@CookieParam("AccessToken") String token) {
        ResponseDTO<Object> resp = userService.leaveRoom(UUID.fromString(token));
        return Response.status(resp.getStatus()).build();
    }

    @Path("/create-room")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response createRoom(@CookieParam("AccessToken") String token, RoomDTO room) {
        ResponseDTO<Object> resp = chatManagmentService.addRoomToChat(room.getChatId(), UUID.fromString(token),
                room.getName());
        return Response.status(resp.getStatus()).build();
    }

    @Path("/delete-room")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @DELETE
    public Response deleteRoom(@CookieParam("AccessToken") String token, RoomDTO room) {
        ResponseDTO<Object> resp = chatManagmentService.deleteRoomFromChat(room.getChatId(), UUID.fromString(token),
                room.getId());
        return Response.status(resp.getStatus()).build();
    }

    @Path("/send-message")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response sendMessage(@CookieParam("AccessToken") String token, MessageDTO message) {
        ResponseDTO<Object> resp = chatManagmentService.sendMessage(UUID.fromString(token), message.getChatId(),
                message.getContent());
        return Response.status(resp.getStatus()).build();
    }

    @Path("/get-messages")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response getMessages(@CookieParam("AccessToken") String token, ChatDTO chat) {
        ResponseDTO<MessageDTO> resp = chatManagmentService.getMessages(chat.getId());
        return Response.status(resp.getStatus()).entity(resp.getEntities()).build();
    }

    @Path("/get-users")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response getUsers(@CookieParam("AccessToken") String token, ChatDTO chat) {
        ResponseDTO<UserDTO> resp = chatManagmentService.getUsers(chat.getId());
        return Response.status(resp.getStatus()).entity(resp.getEntities()).build();
    }

    @Path("/get-rooms")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response getRooms(@CookieParam("AccessToken") String token, ChatDTO chat) {
        ResponseDTO<RoomDTO> resp = chatManagmentService.getRooms(chat.getId());
        return Response.status(resp.getStatus()).entity(resp.getEntities()).build();
    }

    @Path("/get-users-in-room")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response getRooms(@CookieParam("AccessToken") String token, RoomDTO room) {
        ResponseDTO<UserDTO> resp = chatManagmentService.getUsersInRoom(room.getId());
        return Response.status(resp.getStatus()).entity(resp.getEntities()).build();
    }
}