package to.game.rest.mappers;

import jakarta.persistence.EntityNotFoundException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import to.game.model.dto.ErrorResponseDTO;

public class EntityNotFoundExceptionMapper implements ExceptionMapper<EntityNotFoundException> {
    @Override
    public Response toResponse(EntityNotFoundException e) {
        ErrorResponseDTO<EntityNotFoundException> response = new ErrorResponseDTO<>();
        response.setStatus(404);
        response.setMessage(String.format("%s not found", e.getMessage()));
        response.setException(e);
        return Response.status(Response.Status.NOT_FOUND).entity(response).build();
    }
}
