package to.game.rest.endpoints;

import java.util.UUID;

import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.CookieParam;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import to.game.model.dto.GameDTO;
import to.game.model.dto.ResponseDTO;
import to.game.model.dto.UserDTO;
import to.game.model.entity.GameEntity;
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
    public Response getAll() {
        ResponseDTO<GameEntity> resp = gameService.getAllGames();
        return Response.status(resp.getStatus()).entity(resp.getEntities()).build();
    }

    @Path("/all-by-user")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response getAllByUser(@CookieParam("AccessToken") String token) {
        ResponseDTO<GameEntity> resp = gameService.getAllGamesByUser(UUID.fromString(token));
        return Response.status(resp.getStatus()).entity(resp.getEntities()).build();
    }

    @Path("/add-game")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response addGame(@Context ContainerRequestContext ctx, GameDTO game) {
        UserDTO user = (UserDTO) ctx.getProperty("user");
        ResponseDTO<Object> resp = userService.addGame(user.getId(), game.getName());
        return Response.status(resp.getStatus()).build();
    }

    @Path("/remove-game")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @DELETE
    public Response removeGame(@Context ContainerRequestContext ctx, GameDTO game) {
        UserDTO user = (UserDTO) ctx.getProperty("user");
        ResponseDTO<Object> resp = userService.deleteGame(user.getId(), game.getName());
        return Response.status(resp.getStatus()).build();
    }
}
