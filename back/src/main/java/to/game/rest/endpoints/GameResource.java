package to.game.rest.endpoints;

import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import to.game.model.dto.GameDTO;
import to.game.model.dto.UserDTO;
import to.game.service.GameService;
import to.game.service.UserService;

@Path("/game")
public class GameResource {
    @Inject
    GameService gameService;

    @Inject
    UserService userService;

    @Path("/all")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response getAllByUser(UserDTO user) {
        return Response.ok().entity(gameService.getAllGames()).build();
    }

    @Path("/add-game")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response addGame(@Context ContainerRequestContext ctx, GameDTO game) {
        UserDTO user = (UserDTO) ctx.getProperty("user");
        userService.addGame(user.getId(), game.getName());
        return Response.status(Response.Status.CREATED).build();
    }

    @Path("/remove-game")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @DELETE
    public Response removeGame(@Context ContainerRequestContext ctx, GameDTO game) {
        UserDTO user = (UserDTO) ctx.getProperty("user");
        userService.deleteGame(user.getId(), game.getName());
        return Response.ok().build();
    }
}
