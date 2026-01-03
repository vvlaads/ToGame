package to.game.model.dto;

import java.util.Set;

import lombok.Getter;
import lombok.Setter;
import to.game.model.entity.GameEntity;

@Getter
@Setter
public class GameDTO {
    public GameDTO() {
    }

    public GameDTO(GameEntity game) {
        this.name = game.getName();
        this.descr = game.getDescr();
        this.tags = game.getTags().stream().map(TagDTO::new).collect(java.util.stream.Collectors.toSet());
    }

    private Set<TagDTO> tags;
    private String name;
    private String descr;
}
