package to.game.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageDTO {
    public String content;
    public Long senderId;
    public Long chatId;
}
