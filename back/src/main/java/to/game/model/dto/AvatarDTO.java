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
            this.id = avatar.getId();
            this.name = avatar.getName();
            this.descr = avatar.getDescr();
            this.filepath = avatar.getFilepath();
            this.bannerFilePath = avatar.getBannerFilePath();
        }
    }

    Long id;
    String name;
    String descr;
    String filepath;
    String bannerFilePath;
}
