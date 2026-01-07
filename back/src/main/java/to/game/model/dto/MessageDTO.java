package to.game.model.dto;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import to.game.model.entity.MessageEntity;

@Getter
@Setter
public class MessageDTO {
    public MessageDTO() {}

    public MessageDTO(MessageEntity message) {
        this.content = message.getContent();
        this.datetime = message.getDatetime();
        this.senderId = message.getSenderId().getId();
    }

    private LocalDateTime datetime;
    private String content;
    private Long senderId;
    private Long chatId;
}
