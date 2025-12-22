package to.game.rest.endpoints;

import jakarta.inject.Inject;
import jakarta.ws.rs.Path;
import to.game.service.GameService;

@Path("/game")
public class GameResource {
    @Inject
    GameService gameService;

}
