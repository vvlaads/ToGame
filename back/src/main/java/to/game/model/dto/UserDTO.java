package to.game.model.dto;

import java.util.Set;

import lombok.Getter;
import lombok.Setter;
import to.game.model.entity.UserEntity;

@Getter
@Setter
public class UserDTO {
    public UserDTO(UserEntity user) {
        this.id = user.getId();
        this.name = user.getName();
        this.password = user.getPassword();
        this.games = user.getGames().stream().map(game -> new GameDTO(game))
                .collect(java.util.stream.Collectors.toSet());
    }

    Long id;
    String name;
    String password;
    Set<GameDTO> games;
}
