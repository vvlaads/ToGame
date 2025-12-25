package to.game.model.repos;

import java.io.Serializable;
import java.util.Optional;

import jakarta.data.repository.CrudRepository;
import jakarta.data.repository.Query;
import jakarta.data.repository.Repository;
import jakarta.enterprise.context.ApplicationScoped;
import to.game.model.entity.GameEntity;

@Repository
@ApplicationScoped
public interface GameRepository extends CrudRepository<GameEntity, Long>, Serializable {
    @Query("SELECT g FROM GameEntity g left join fetch g.users WHERE g.name = :name")
    Optional<GameEntity> findByName(String name);

}
