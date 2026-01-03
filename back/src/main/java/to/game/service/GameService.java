package to.game.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import to.game.exceptions.EntityNotFoundException;
import to.game.model.dto.GameDTO;
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
    public ResponseDTO<GameDTO> getAllGames() {
        List<GameDTO> games = new ArrayList<>();
        for (GameEntity game : gameRepo.findAllJoinTag())
            games.add(new GameDTO(game));
        return new ResponseDTO<>(200, "", games);
    }

    @Transactional
    public ResponseDTO<GameDTO> getAllGamesByUser(UUID accessToken) {
        UserEntity user = userRepo.findByAccessToken(accessToken)
                .orElseThrow(() -> new EntityNotFoundException("User"));
        List<GameDTO> games = new ArrayList<>();
        for (GameEntity game : gameRepo.findAllByUserIdWithTags(user.getId()))
            games.add(new GameDTO(game));
        return new ResponseDTO<>(200, "", games);
    }
}
