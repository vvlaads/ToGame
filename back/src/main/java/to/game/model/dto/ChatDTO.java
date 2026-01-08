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
            this.ownerId = chat.getOwner().getId();
            this.filepath = chat.getFilepath();
        }
    }

    Long id;
    String name;
    String descr;
    Long ownerId;
    String filepath;
    Set<UserDTO> users;
}
