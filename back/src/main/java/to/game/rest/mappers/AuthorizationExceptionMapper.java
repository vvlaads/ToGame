package to.game.rest.mappers;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import to.game.exceptions.AuthorizationException;
import to.game.model.dto.ErrorResponseDTO;

public class AuthorizationExceptionMapper implements ExceptionMapper<AuthorizationException> {
    @Override
    public Response toResponse(AuthorizationException e) {
        ErrorResponseDTO<AuthorizationException> response = new ErrorResponseDTO<>();
        response.setStatus(401);
        response.setMessage(e.getMessage());
        response.setException(e);
        return Response.status(Response.Status.UNAUTHORIZED).entity(response).build();
    }
}
