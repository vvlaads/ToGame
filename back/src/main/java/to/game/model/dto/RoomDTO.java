package to.game.model.dto;

import lombok.Getter;
import lombok.Setter;
import to.game.model.entity.RoomEntity;

@Getter
@Setter
public class RoomDTO {
    public RoomDTO() {
    }

    public RoomDTO(RoomEntity room){
        this.id = room.getId();
        this.name = room.getName();
    }

    private Long chatId;
    private Long id;
    private String name;
}
