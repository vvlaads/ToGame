package to.game.model.entity;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

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
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "user_table")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @Length(max = 30)
    @NotBlank
    private String name;

    @NotBlank
    private String password;

    @NotNull
    private UUID accessToken;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "avatar_id", nullable = true)
    private AvatarEntity avatar;

    public void addAvatar(AvatarEntity avatar) {
        this.avatar = avatar;
    }

    public void deleteAvatar() {
        this.avatar = null;
    }

    @Length(max = 100)
    private String descr;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "room_id", nullable = true)
    private RoomEntity room;

    public void setRoom(RoomEntity room) {
        this.room = room;
    }

    public void deleteRoom() {
        this.room = null;
    }

    @ManyToMany
    @JoinTable(name = "user_to_game", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "game_id"))
    private Set<GameEntity> games = new HashSet<>();

    public void addGame(GameEntity game) {
        games.add(game);
        game.getUsers().add(this);
    }

    public void deleteGame(GameEntity game) {
        games.remove(game);
        game.getUsers().remove(this);
    }

    @ManyToMany
    @JoinTable(name = "user_to_chat", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "chat_id"))
    private Set<ChatEntity> chats = new HashSet<>();

    public void addChat(ChatEntity chat) {
        chats.add(chat);
        chat.getUsers().add(this);
    }

    public void deleteChat(ChatEntity chat) {
        chats.remove(chat);
        chat.getUsers().remove(this);
    }

    @ManyToMany
    @JoinTable(name = "user_to_friend", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "friend_id"))
    private Set<UserEntity> friends = new HashSet<>();

    @OneToMany(mappedBy = "senderId", fetch = FetchType.LAZY)
    private Set<LikeEntity> sentLikes = new HashSet<>();

    @OneToMany(mappedBy = "receiverId", fetch = FetchType.LAZY)
    private Set<LikeEntity> receivedLikes = new HashSet<>();
}
