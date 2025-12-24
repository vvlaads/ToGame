package to.game.rest.endpoints;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import to.game.model.dto.ChatDTO;
import to.game.model.dto.MessageDTO;
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
    public Response create(@Context ContainerRequestContext ctx, ChatDTO chat) {
        UserDTO user = (UserDTO) ctx.getProperty("user");
        chatManagmentService.createChat(user.getId(), chat.getName(), chat.getDescr());
        return Response.status(Response.Status.CREATED).build();
    }

    @Path("/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @PATCH
    @Transactional
    public Response update(@Context ContainerRequestContext ctx, ChatDTO chat) {
        UserDTO user = (UserDTO) ctx.getProperty("user");
        chatManagmentService.renameChat(chat.getId(), user.getId(), chat.getName());
        chatManagmentService.changeDescr(chat.getId(), user.getId(), chat.getDescr());
        return Response.ok().build();
    }

    @Path("/delete")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @DELETE
    public Response delete(@Context ContainerRequestContext ctx, ChatDTO chat) {
        UserDTO user = (UserDTO) ctx.getProperty("user");
        chatManagmentService.deleteChat(chat.getId(), user.getId());
        return Response.ok().build();
    }

    @Path("/join-chat")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response joinChat(@Context ContainerRequestContext ctx, Long chatId) {
        UserDTO user = (UserDTO) ctx.getProperty("user");
        userService.joinChat(user.getId(), chatId);
        return Response.ok().build();
    }

    @Path("/leave-chat")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @DELETE
    public Response leaveChat(@Context ContainerRequestContext ctx, Long chatId) {
        UserDTO user = (UserDTO) ctx.getProperty("user");
        userService.leaveChat(user.getId(), chatId);
        return Response.ok().build();
    }

    @Path("/join-room")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response joinRoom(@Context ContainerRequestContext ctx, RoomDTO room) {
        UserDTO user = (UserDTO) ctx.getProperty("user");
        userService.joinRoom(user.getId(), room.getChatId(), room.getId());
        return Response.ok().build();
    }

    @Path("/leave-room")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @DELETE
    public Response leaveRoom(@Context ContainerRequestContext ctx) {
        UserDTO user = (UserDTO) ctx.getProperty("user");
        userService.leaveRoom(user.getId());
        return Response.ok().build();
    }

    @Path("/create-room")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response createRoom(@Context ContainerRequestContext ctx, RoomDTO room) {
        UserDTO user = (UserDTO) ctx.getProperty("user");
        chatManagmentService.addRoomToChat(room.getChatId(), user.getId(), room.getName());
        return Response.ok().build();
    }

    @Path("/delete-room")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @DELETE
    public Response deleteRoom(@Context ContainerRequestContext ctx, RoomDTO room) {
        UserDTO user = (UserDTO) ctx.getProperty("user");
        chatManagmentService.deleteRoomFromChat(room.getChatId(), user.getId(), room.getId());
        return Response.ok().build();
    }

    @Path("/send-message")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response sendMessage(@Context ContainerRequestContext ctx, MessageDTO message) {
        UserDTO user = (UserDTO) ctx.getProperty("user");
        chatManagmentService.sendMessage(user.getId(), message.getChatId(), message.getContent());
        return Response.ok().build();
    }
}