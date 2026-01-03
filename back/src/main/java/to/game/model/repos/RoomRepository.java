package to.game.model.repos;

import java.io.Serializable;

import jakarta.data.repository.CrudRepository;
import jakarta.data.repository.Repository;
import jakarta.enterprise.context.ApplicationScoped;
import to.game.model.entity.RoomEntity;

@Repository
@ApplicationScoped
public interface RoomRepository extends CrudRepository<RoomEntity, Long>, Serializable{
    
}
