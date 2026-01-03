package to.game.model.repos;

import java.io.Serializable;
import java.util.Optional;

import jakarta.data.repository.CrudRepository;
import jakarta.data.repository.Query;
import jakarta.data.repository.Repository;
import jakarta.enterprise.context.ApplicationScoped;
import to.game.model.entity.ChatEntity;

@Repository
@ApplicationScoped
public interface ChatRepository extends CrudRepository<ChatEntity, Long>, Serializable {
    @Query("select c from ChatEntity c left join fetch c.users where c.id = :id")
    Optional<ChatEntity> findByIdWithUsers(Long id);

    @Query("select c from ChatEntity c left join fetch c.rooms where c.id = :id")
    Optional<ChatEntity> findByIdWithRooms(Long id);

    @Query("select c from ChatEntity c left join fetch c.messages where c.id = :id")
    Optional<ChatEntity> findByIdWithMessages(Long id);
}
