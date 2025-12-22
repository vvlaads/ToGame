package to.game.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import to.game.model.repos.GameRepopsitory;

@ApplicationScoped
public class GameService {
    @Inject
    GameRepopsitory gameRepo;

    
}
