package to.game.model.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResponseDTO<T> {
    public ResponseDTO(Integer status) {
        this.status = status;
    }

    public ResponseDTO(Integer status, String message) {
        this.status = status;
        this.message = message;
    }

    public ResponseDTO(Integer status, String message, List<T> entities) {
        this.status = status;
        this.message = message;
        this.entities = entities;
    }

    Integer status;
    String message;
    List<T> entities;
}
