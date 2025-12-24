package to.game.service;

import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import to.game.model.entity.GameEntity;
import to.game.model.entity.UserEntity;
import to.game.model.repos.GameRepopsitory;
import to.game.model.repos.UserRepository;

@ApplicationScoped
public class GameService {
    @Inject
    GameRepopsitory gameRepo;

    @Inject
    UserRepository userRepo;

    @Transactional
    public List<GameEntity> getAllGames() {
        return gameRepo.findAll().toList();
    }

    @Transactional
    public List<GameEntity> getAllGamesByUser(Long userId) {
        UserEntity user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return user.getGames().stream().toList();
    }
}
