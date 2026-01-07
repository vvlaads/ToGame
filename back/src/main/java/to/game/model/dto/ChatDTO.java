package to.game.model.dto;

import java.util.Set;
import lombok.Getter;
import lombok.Setter;
import to.game.model.entity.ChatEntity;

@Getter
@Setter
public class ChatDTO {
    public ChatDTO() {
    }

    public ChatDTO(ChatEntity chat) {
        if (chat != null) {
            this.id = chat.getId();
            this.descr = chat.getDescr();
            this.name = chat.getName();
        }
    }

    Long id;
    String name;
    String descr;
    Long ownerId;
    Set<UserDTO> users;
}
