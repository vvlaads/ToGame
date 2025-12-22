package to.game.model.repos;

import java.util.Optional;

import jakarta.data.repository.CrudRepository;
import to.game.model.entity.LikeEntity;

public interface LikeRepository extends CrudRepository<LikeEntity, Long> {

    Optional<LikeEntity> findBySenderIdAndReceiverId(Long senderId, Long receiverId);

}
