package to.game.rest.mappers;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import to.game.exceptions.DataConsistencyException;
import to.game.model.dto.ErrorResponseDTO;

public class DataConsistencyExceptionMapper implements ExceptionMapper<DataConsistencyException> {

    @Override
    public Response toResponse(DataConsistencyException e) {
        ErrorResponseDTO<DataConsistencyException> response = new ErrorResponseDTO<>();
        response.setStatus(400);
        response.setMessage(e.getMessage());
        response.setException(e);
        return Response.status(400).entity(response).build();
    }

}
