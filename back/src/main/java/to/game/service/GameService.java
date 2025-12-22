package to.game.service;

import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import to.game.model.entity.GameEntity;
import to.game.model.repos.GameRepopsitory;

@ApplicationScoped
public class GameService {
    @Inject
    GameRepopsitory gameRepo;

    public List<GameEntity> getAllGames() {
        return gameRepo.findAll().toList();
    }
}
