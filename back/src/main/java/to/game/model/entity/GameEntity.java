package to.game.model.entity;

import java.util.HashSet;
import java.util.Set;

import org.hibernate.validator.constraints.Length;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "game")
public class GameEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Length(max = 100)
    private String name;

    @Length(max = 100)
    private String filepath;

    @Length(max = 200)
    private String descr;

    @ManyToMany
    @JoinTable(name = "game_tag", joinColumns = @JoinColumn(name = "game_id"), inverseJoinColumns = @JoinColumn(name = "tag_id"))
    private Set<TagEntity> tags = new HashSet<>();

    @ManyToMany(mappedBy = "games")
    private Set<UserEntity> users = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof GameEntity))
            return false;
        GameEntity that = (GameEntity) o;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
