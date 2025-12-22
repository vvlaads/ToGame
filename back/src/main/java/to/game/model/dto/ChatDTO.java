package to.game.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatDTO {
    Long id;
    String name;
    String descr;
    Long ownerId;
}
