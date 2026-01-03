package to.game.model.repos;

import java.io.Serializable;
import java.util.Optional;
import java.util.UUID;

import jakarta.data.repository.CrudRepository;
import jakarta.data.repository.Query;
import jakarta.data.repository.Repository;
import jakarta.enterprise.context.ApplicationScoped;
import to.game.model.entity.UserEntity;

@Repository
@ApplicationScoped
public interface UserRepository extends CrudRepository<UserEntity, Long>, Serializable {
	@Override
	@Query("select u from UserEntity u left join fetch u.games left join fetch u.chats left join fetch u.friends where u.id = :id")
	Optional<UserEntity> findById(Long id);

	@Query("select u from UserEntity u left join fetch u.chats where u.id = :id")
	Optional<UserEntity> findByIdWithChats(Long id);

	@Query("SELECT u FROM UserEntity u WHERE u.name = :name AND u.password = :password")
	Optional<UserEntity> findByNameAndPassword(String name, String password);

	@Query("""
			select u from UserEntity u
			left join fetch u.games
			left join fetch u.friends
			where u.accessToken = :accessToken
			""")
	Optional<UserEntity> findByAccessToken(UUID accessToken);

	@Query("""
			select u from UserEntity u
			left join fetch u.chats
			where u.accessToken = :accessToken
			""")
	Optional<UserEntity> findByAccessTokenWithChats(UUID accessToken);

	@Query("""
			select u from UserEntity u
			left join fetch u.games
			where u.accessToken = :accessToken
			""")
	Optional<UserEntity> findByAccessTokenWithGames(UUID accessToken);

	@Query("""
			select u from UserEntity u
			left join fetch u.games
			where u.id = :id
			""")
	Optional<UserEntity> findByIdWithGames(Long id);
}
