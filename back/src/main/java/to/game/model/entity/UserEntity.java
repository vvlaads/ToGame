package to.game.model.entity;

import java.util.HashSet;
import java.util.Set;

import org.hibernate.validator.constraints.Length;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "user")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private long id;

    @Length(max = 30)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "avatar_id", nullable = true)
    private AvatarEntity avatar;

    @Length(max = 100)
    private String descr;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "room_id", nullable = true)
    private RoomEntity room;

    @ManyToMany
    @JoinTable(name = "user_to_game", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "game_id"))
    private Set<GameEntity> games = new HashSet<>();

    @ManyToMany
    @JoinTable(name = "user_to_chat", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "chat_id"))
    private Set<ChatEntity> chats = new HashSet<>();

    @ManyToMany
    @JoinTable(name = "user_to_friend", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "friend_id"))
    private Set<UserEntity> friends = new HashSet<>();

    @OneToMany(mappedBy = "sender", fetch = FetchType.LAZY)
    private Set<LikeEntity> sentLikes = new HashSet<>();

    @OneToMany(mappedBy = "receiver", fetch = FetchType.LAZY)
    private Set<LikeEntity> receivedLikes = new HashSet<>();
}
