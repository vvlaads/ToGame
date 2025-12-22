package to.game.model.repos;

import jakarta.data.repository.CrudRepository;
import jakarta.data.repository.Repository;
import to.game.model.entity.UserEntity;

@Repository
public interface UserRepository extends CrudRepository<UserEntity, Long> {

}
