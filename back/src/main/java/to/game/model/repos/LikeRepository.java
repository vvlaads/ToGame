package to.game.model.repos;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;

import jakarta.data.repository.CrudRepository;
import jakarta.data.repository.Query;
import jakarta.data.repository.Repository;
import jakarta.enterprise.context.ApplicationScoped;
import to.game.model.entity.LikeEntity;

@Repository
@ApplicationScoped
public interface LikeRepository extends CrudRepository<LikeEntity, Long>, Serializable {
    @Query("SELECT l FROM LikeEntity l WHERE l.sender.id = :senderId AND l.receiver.id = :receiverId")
    Optional<LikeEntity> findBySenderIdAndReceiverId(Long senderId, Long receiverId);

    @Query("SELECT l FROM LikeEntity l WHERE l.receiver.id = :receiverId")
    List<LikeEntity> findByReceiverId(Long receiverId);

    @Query("SELECT l FROM LikeEntity l WHERE l.sender.id = :senderId")
    List<LikeEntity> findBySenderId(Long senderId);
}
