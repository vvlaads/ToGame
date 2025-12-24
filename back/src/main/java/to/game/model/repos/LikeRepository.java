package to.game.model.repos;

import java.util.Optional;

import jakarta.data.repository.CrudRepository;
import jakarta.data.repository.Query;
import jakarta.data.repository.Repository;
import to.game.model.entity.LikeEntity;

@Repository
public interface LikeRepository extends CrudRepository<LikeEntity, Long> {
    @Query("SELECT l FROM LikeEntity l WHERE l.senderId = :senderId AND l.receiverId = :receiverId")
    Optional<LikeEntity> findBySenderIdAndReceiverId(Long senderId, Long receiverId);

}
