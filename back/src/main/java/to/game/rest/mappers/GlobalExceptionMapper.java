package to.game.rest.mappers;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import to.game.model.dto.ErrorResponseDTO;

public class GlobalExceptionMapper implements ExceptionMapper<Throwable> {

    @Override
    public Response toResponse(Throwable e) {
        ErrorResponseDTO<Throwable> response = new ErrorResponseDTO<>();
        response.setStatus(500);
        response.setMessage(e.getMessage());
        response.setException(e);
        return Response.serverError().entity(response).build();
    }

}
