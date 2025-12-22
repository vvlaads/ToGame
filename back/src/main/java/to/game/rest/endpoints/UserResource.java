package to.game.rest.endpoints;

import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.NewCookie;
import jakarta.ws.rs.core.Response;
import to.game.model.dto.AccessTokenDTO;
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
        NewCookie cookie = new NewCookie("AccessToken", token.getAccessToken().toString());
        return Response.ok().cookie(cookie).build();
    }

    @Path("/sign-in")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response signIn(UserDTO user) {
        AccessTokenDTO token = userService.signIn(user.getName(), user.getPassword());
        NewCookie cookie = new NewCookie("AccessToken", token.getAccessToken().toString());
        return Response.ok().cookie(cookie).build();
    }

}
