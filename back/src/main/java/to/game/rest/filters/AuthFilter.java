package to.game.rest.filters;

import java.util.UUID;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.Cookie;
import jakarta.ws.rs.ext.Provider;
import to.game.exceptions.AuthorizationException;
import to.game.model.dto.AccessTokenDTO;

@Provider
public class AuthFilter implements ContainerRequestFilter {

    @Override
    public void filter(ContainerRequestContext requestContext) {
        if (requestContext.getUriInfo().getPath().contains("user/register") ||
                requestContext.getUriInfo().getPath().contains("game/all") ||
                requestContext.getUriInfo().getPath().contains("user/sign-in")) {
            return;
        }

        Cookie cookie = requestContext.getCookies().get("AccessToken");

        if (cookie == null) {
            throw new AuthorizationException("AccessToken cookie is missing");
        }

        AccessTokenDTO token = new AccessTokenDTO();
        token.setAccessToken(UUID.fromString(cookie.getValue()));

        requestContext.setProperty("token", token);
    }
}
