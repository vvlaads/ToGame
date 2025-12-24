package to.game.model.repos;

import jakarta.data.repository.CrudRepository;
import jakarta.data.repository.Repository;
import to.game.model.entity.AvatarEntity;

@Repository
public interface AvatarRepository extends CrudRepository<AvatarEntity, Long> {

}
