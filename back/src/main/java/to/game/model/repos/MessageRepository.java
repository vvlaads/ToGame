package to.game.model.repos;

import java.io.Serializable;
import java.util.List;
import java.util.UUID;

import jakarta.data.repository.CrudRepository;
import jakarta.data.repository.Query;
import jakarta.data.repository.Repository;
import jakarta.enterprise.context.ApplicationScoped;
import to.game.model.entity.MessageEntity;

@Repository
@ApplicationScoped
public interface MessageRepository extends CrudRepository<MessageEntity, UUID>, Serializable {
    @Query("select m from MessageEntity m left join fetch m.senderId where m.chatId.id = :chatId")
    List<MessageEntity> findByChatIdWithUsers(Long chatId);
}
