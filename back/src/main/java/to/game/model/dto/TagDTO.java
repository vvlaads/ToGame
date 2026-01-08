package to.game.model.dto;

import lombok.Getter;
import lombok.Setter;
import to.game.model.entity.TagEntity;

@Getter
@Setter
public class TagDTO {
    public TagDTO(){}

    public TagDTO(TagEntity tag) {
        this.name = tag.getName();
    }

    private String name;
}
