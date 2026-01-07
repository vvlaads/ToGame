package to.game.model.dto;

import lombok.Getter;
import lombok.Setter;
import to.game.model.entity.AvatarEntity;

@Getter
@Setter
public class AvatarDTO {
    public AvatarDTO() {
    }

    public AvatarDTO(AvatarEntity avatar) {
        if (avatar != null) {
            this.name = avatar.getName();
            this.descr = avatar.getDescr();
            this.filepath = avatar.getFilepath();
        }
    }

    Long id;
    String name;
    String descr;
    String filepath;
}
