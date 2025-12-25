package to.game.service;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import to.game.exceptions.EntityNotFoundException;
import to.game.model.dto.ResponseDTO;
import to.game.model.entity.GameEntity;
import to.game.model.entity.UserEntity;
import to.game.model.repos.GameRepository;
import to.game.model.repos.UserRepository;

@ApplicationScoped
public class GameService {
    @Inject
    GameRepository gameRepo;

    @Inject
    UserRepository userRepo;

    @Transactional
    public ResponseDTO<GameEntity> getAllGames() {
        return new ResponseDTO<>(200, "", gameRepo.findAll().toList());
    }

    @Transactional
    public ResponseDTO<GameEntity> getAllGamesByUser(UUID accessToken) {
        UserEntity user = userRepo.findByAccessToken(accessToken)
                .orElseThrow(() -> new EntityNotFoundException("User"));
        return new ResponseDTO<>(200, "", user.getGames().stream().toList());
    }
}
