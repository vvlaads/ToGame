package to.game.rest.endpoints;

import java.util.UUID;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.CookieParam;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.NewCookie;
import jakarta.ws.rs.core.Response;
import to.game.model.dto.AccessTokenDTO;
import to.game.model.dto.AvatarDTO;
import to.game.model.dto.ResponseDTO;
import to.game.model.dto.UserDTO;
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
        NewCookie cookie = new NewCookie.Builder("AccessToken").value(token.getAccessToken().toString())
                .maxAge(24 * 60 * 60).path("/").build();
        return Response.ok().cookie(cookie).build();
    }

    @Path("/sign-in")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response signIn(UserDTO user) {
        AccessTokenDTO token = userService.signIn(user.getName(), user.getPassword());
        NewCookie cookie = new NewCookie.Builder("AccessToken").value(token.getAccessToken().toString())
                .maxAge(24 * 60 * 60).path("/").build();
        return Response.ok().cookie(cookie).build();
    }

    @Path("/info")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response info(@CookieParam("AccessToken") String token) {
        ResponseDTO<UserDTO> resp = userService.userInfo(UUID.fromString(token));
        return Response.status(resp.getStatus()).entity(resp.getEntities()).build();
    }

    @Path("/info-by-id")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response infoById(UserDTO user) {
        ResponseDTO<UserDTO> resp = userService.userInfoById(user.getId());
        return Response.status(resp.getStatus()).entity(resp.getEntities()).build();
    }

    @Path("/delete")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @DELETE
    public Response delete(@CookieParam("AccessToken") String token) {
        ResponseDTO<Object> resp = userService.deleteUser(UUID.fromString(token));
        return Response.status(resp.getStatus()).build();
    }

    @Path("/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @PATCH
    @Transactional
    public Response update(@CookieParam("AccessToken") String token, UserDTO newUser) {
        userService.changeName(UUID.fromString(token), newUser.getName());
        ResponseDTO<Object> resp = userService.changeDescr(UUID.fromString(token), newUser.getDescr());
        return Response.status(resp.getStatus()).build();
    }

    @Path("/update-avatar")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @PATCH
    public Response updateAvatar(@CookieParam("AccessToken") String token, AvatarDTO avatar) {
        ResponseDTO<Object> resp = userService.setAvatar(UUID.fromString(token), avatar.getId());
        return Response.status(resp.getStatus()).build();
    }

    @Path("/delete-avatar")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @DELETE
    public Response deleteAvatar(@CookieParam("AccessToken") String token) {
        ResponseDTO<Object> resp = userService.removeAvatar(UUID.fromString(token));
        return Response.status(resp.getStatus()).build();
    }

    @Path("/send-like")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response sendLike(@CookieParam("AccessToken") String token, UserDTO reciver) {
        ResponseDTO<Object> resp = userService.sendLike(UUID.fromString(token), reciver.getId());
        return Response.status(resp.getStatus()).build();
    }

    @Path("/delete-friend")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @DELETE
    public Response deleteFriend(@CookieParam("AccessToken") String token, UserDTO reciver) {
        ResponseDTO<Object> resp = userService.removeFriend(UUID.fromString(token), reciver.getId());
        return Response.status(resp.getStatus()).build();
    }

    @Path("/get-friends")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response getFriends(@CookieParam("AccessToken") String token) {
        ResponseDTO<UserDTO> resp = userService.getFriends(UUID.fromString(token));
        return Response.status(resp.getStatus()).entity(resp.getEntities()).build();
    }

    @Path("/get-recieved-likes")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response getRecivedLikes(@CookieParam("AccessToken") String token) {
        ResponseDTO<UserDTO> resp = userService.getRecievedLikes(UUID.fromString(token));
        return Response.status(resp.getStatus()).entity(resp.getEntities()).build();
    }

    @Path("/get-sent-likes")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response getSentLikes(@CookieParam("AccessToken") String token) {
        ResponseDTO<UserDTO> resp = userService.getSentLikes(UUID.fromString(token));
        return Response.status(resp.getStatus()).entity(resp.getEntities()).build();
    }
}
