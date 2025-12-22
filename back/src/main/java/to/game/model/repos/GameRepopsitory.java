package to.game.model.repos;

import java.util.Optional;

import jakarta.data.repository.CrudRepository;
import jakarta.data.repository.Repository;
import to.game.model.entity.GameEntity;

@Repository
public interface GameRepopsitory extends CrudRepository<GameEntity, Long> {
    Optional<GameEntity> findByName(String name);

}
