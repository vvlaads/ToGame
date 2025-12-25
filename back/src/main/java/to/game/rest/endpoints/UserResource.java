package to.game.rest.endpoints;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.NewCookie;
import jakarta.ws.rs.core.Response;
import to.game.model.dto.AccessTokenDTO;
import to.game.model.dto.AvatarDTO;
import to.game.model.dto.ResponseDTO;
import to.game.model.dto.UserDTO;
import to.game.model.entity.LikeEntity;
import to.game.model.entity.UserEntity;
import to.game.service.UserService;

@Path("/user")
public class UserResource {
    @Inject
    UserService userService;

    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response register(UserDTO user) {
        AccessTokenDTO token = userService.createUser(user.getName(), user.getPassword(), user.getGames());
        NewCookie cookie = new NewCookie.Builder("accessToken").value(token.getAccessToken().toString())
                .maxAge(24 * 60 * 60).build();
        return Response.ok().cookie(cookie).build();
    }

    @Path("/sign-in")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response signIn(UserDTO user) {
        AccessTokenDTO token = userService.signIn(user.getName(), user.getPassword());
        NewCookie cookie = new NewCookie.Builder("accessToken").value(token.getAccessToken().toString())
                .maxAge(24 * 60 * 60).build();
        return Response.ok().cookie(cookie).build();
    }

    @Path("/info")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response info(@Context ContainerRequestContext ctx) {
        UserDTO user = (UserDTO) ctx.getProperty("user");
        ResponseDTO<UserEntity> resp = userService.userInfo(user.getId());
        return Response.status(resp.getStatus()).entity(resp.getEntities()).build();
    }

    @Path("/info-by-id")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response infoById(UserDTO user) {
        ResponseDTO<UserEntity> resp = userService.userInfo(user.getId());
        return Response.status(resp.getStatus()).entity(resp.getEntities()).build();
    }

    @Path("/delete")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @DELETE
    public Response delete(@Context ContainerRequestContext ctx) {
        UserDTO user = (UserDTO) ctx.getProperty("user");
        ResponseDTO<Object> resp = userService.deleteUser(user.getId());
        return Response.status(resp.getStatus()).build();
    }

    @Path("/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @PATCH
    @Transactional
    public Response update(@Context ContainerRequestContext ctx, UserDTO newUser) {
        UserDTO user = (UserDTO) ctx.getProperty("user");
        userService.changeName(user.getId(), newUser.getName());
        ResponseDTO<Object> resp = userService.changeDescr(user.getId(), newUser.getDescr());
        return Response.status(resp.getStatus()).build();
    }

    @Path("/update-avatar")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @PATCH
    public Response updateAvatar(@Context ContainerRequestContext ctx, AvatarDTO avatar) {
        UserDTO user = (UserDTO) ctx.getProperty("user");
        ResponseDTO<Object> resp = userService.setAvatar(user.getId(), avatar.getId());
        return Response.status(resp.getStatus()).build();
    }

    @Path("/delete-avatar")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @DELETE
    public Response deleteAvatar(@Context ContainerRequestContext ctx) {
        UserDTO user = (UserDTO) ctx.getProperty("user");
        ResponseDTO<Object> resp = userService.removeAvatar(user.getId());
        return Response.status(resp.getStatus()).build();
    }

    @Path("/send-like")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response sendLike(@Context ContainerRequestContext ctx, UserDTO reciver) {
        UserDTO user = (UserDTO) ctx.getProperty("user");
        ResponseDTO<Object> resp = userService.sendLike(user.getId(), reciver.getId());
        return Response.status(resp.hashCode()).build();
    }

    @Path("/add-friend")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response addFriend(@Context ContainerRequestContext ctx, UserDTO reciver) {
        UserDTO user = (UserDTO) ctx.getProperty("user");
        ResponseDTO<Object> resp = userService.addFriend(user.getId(), reciver.getId());
        return Response.status(resp.getStatus()).build();
    }

    @Path("/delete-friend")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @DELETE
    public Response deleteFriend(@Context ContainerRequestContext ctx, UserDTO reciver) {
        UserDTO user = (UserDTO) ctx.getProperty("user");
        ResponseDTO<Object> resp = userService.removeFriend(user.getId(), reciver.getId());
        return Response.status(resp.getStatus()).build();
    }

    @Path("/get-friends")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response getFriends(@Context ContainerRequestContext ctx) {
        UserDTO user = (UserDTO) ctx.getProperty("user");
        ResponseDTO<UserEntity> resp = userService.getFriends(user.getId());
        return Response.status(resp.getStatus()).entity(resp.getEntities()).build();
    }

    @Path("/get-recieved-likes")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response getRecivedLikes(@Context ContainerRequestContext ctx) {
        UserDTO user = (UserDTO) ctx.getProperty("user");
        ResponseDTO<LikeEntity> resp = userService.getRecievedLikes(user.getId());
        return Response.status(resp.getStatus()).entity(resp.getEntities()).build();
    }

    @Path("/get-sent-likes")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response getSentLikes(@Context ContainerRequestContext ctx) {
        UserDTO user = (UserDTO) ctx.getProperty("user");
        ResponseDTO<LikeEntity> resp = userService.getRecievedLikes(user.getId());
        return Response.status(resp.getStatus()).entity(resp.getEntities()).build();
    }
}
