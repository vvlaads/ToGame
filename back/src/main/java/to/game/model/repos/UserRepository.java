package to.game.model.repos;

import java.util.Optional;
import java.util.UUID;

import jakarta.data.repository.CrudRepository;
import jakarta.data.repository.Query;
import jakarta.data.repository.Repository;
import to.game.model.entity.UserEntity;

@Repository
public interface UserRepository extends CrudRepository<UserEntity, Long> {
    @Query("SELECT u FROM UserEntity u WHERE u.name = :name AND u.password = :password")
    Optional<UserEntity> findByNameAndPassword(String name, String password);

    @Query("SELECT u FROM UserEntity u WHERE u.accessToken = :accessToken")
    Optional<UserEntity> findByAccessToken(UUID accessToken);
}
