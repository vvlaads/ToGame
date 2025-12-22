package to.game.model.dto;

import lombok.Getter;
import lombok.Setter;
import to.game.model.entity.GameEntity;

@Getter
@Setter
public class GameDTO {
    public GameDTO(GameEntity game) {
        this.name = game.getName();
        this.descr = game.getDescr();
    }

    private String name;
    private String descr;
}
