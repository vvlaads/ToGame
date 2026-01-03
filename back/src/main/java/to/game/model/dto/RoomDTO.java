package to.game.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomDTO {
    public RoomDTO() {
    }

    private Long chatId;
    private Long id;
    private String name;
}
