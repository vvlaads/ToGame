package to.game.model.dto;

import java.time.LocalTime;

import lombok.Getter;
import lombok.Setter;
import to.game.model.entity.MessageEntity;

@Getter
@Setter
public class MessageDTO {
    public MessageDTO() {}

    public MessageDTO(MessageEntity message) {
        this.content = message.getContent();
        this.time = message.getTime();
        this.senderId = message.getSenderId().getId();
    }

    private LocalTime time;
    private String content;
    private Long senderId;
    private Long chatId;
}
