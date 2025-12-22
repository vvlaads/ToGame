package to.game.rest.filters;

import java.util.UUID;

import jakarta.inject.Inject;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.Cookie;
import jakarta.ws.rs.ext.Provider;
import to.game.model.dto.UserDTO;
import to.game.model.entity.UserEntity;
import to.game.model.repos.UserRepository;

@Provider
public class AuthFilter implements ContainerRequestFilter {
    @Inject
    UserRepository userRepo;

    @Override
    public void filter(ContainerRequestContext requestContext) {
        if (requestContext.getUriInfo().getPath().equals("user/register") ||
                requestContext.getUriInfo().getPath().equals("user/sign-in")) {
            return;
        }

        Cookie cookie = requestContext.getCookies().get("AccessToken");

        if (cookie == null) {
            throw new RuntimeException("AccessToken cookie is missing");
        }

        UserEntity user = userRepo.findByAccessToken(UUID.fromString(cookie.getValue()))
                .orElseThrow(() -> new RuntimeException());

        UserDTO userDTO = new UserDTO(user);
        requestContext.setProperty("user", userDTO);
    }

}
