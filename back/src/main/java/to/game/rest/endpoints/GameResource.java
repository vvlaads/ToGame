package to.game.rest.endpoints;

import java.util.UUID;

import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.CookieParam;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import to.game.model.dto.GameDTO;
import to.game.model.dto.ResponseDTO;
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
        ResponseDTO<GameDTO> resp = gameService.getAllGames();
        return Response.status(resp.getStatus()).entity(resp.getEntities()).build();
    }

    @Path("/all-by-user")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response getAllByUser(@CookieParam("AccessToken") String token) {
        ResponseDTO<GameDTO> resp = gameService.getAllGamesByUser(UUID.fromString(token));
        return Response.status(resp.getStatus()).entity(resp.getEntities()).build();
    }

    @Path("/add-game")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response addGame(@CookieParam("AccessToken") String token, GameDTO game) {
        ResponseDTO<Object> resp = userService.addGame(UUID.fromString(token), game.getName());
        return Response.status(resp.getStatus()).build();
    }

    @Path("/remove-game")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @DELETE
    public Response removeGame(@CookieParam("AccessToken") String token, GameDTO game) {
        ResponseDTO<Object> resp = userService.deleteGame(UUID.fromString(token), game.getName());
        return Response.status(resp.getStatus()).build();
    }
}
