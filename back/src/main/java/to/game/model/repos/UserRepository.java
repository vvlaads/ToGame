package to.game.model.repos;

import java.util.Optional;
import java.util.UUID;

import jakarta.data.repository.CrudRepository;
import jakarta.data.repository.Repository;
import to.game.model.entity.UserEntity;

@Repository
public interface UserRepository extends CrudRepository<UserEntity, Long> {
    Optional<UserEntity> findByNameAndPassword(String name, String password);

    Optional<UserEntity> findByAccessToken(UUID accessToken);
}
