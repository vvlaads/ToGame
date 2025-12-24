package to.game.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ErrorResponseDTO<E extends Throwable> {
    private Integer status;
    private String message;
    private E exception;
}
