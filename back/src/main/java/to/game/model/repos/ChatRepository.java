package to.game.model.repos;

import jakarta.data.repository.CrudRepository;
import to.game.model.entity.ChatEntity;

public interface ChatRepository extends CrudRepository<ChatEntity, Long> {

}
