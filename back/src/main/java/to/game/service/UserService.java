package to.game.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import to.game.model.dto.AccessTokenDTO;
import to.game.model.dto.GameDTO;
import to.game.model.entity.AvatarEntity;
import to.game.model.entity.ChatEntity;
import to.game.model.entity.GameEntity;
import to.game.model.entity.LikeEntity;
import to.game.model.entity.UserEntity;
import to.game.model.repos.ChatRepository;
import to.game.model.repos.GameRepopsitory;
import to.game.model.repos.LikeRepository;
import to.game.model.repos.UserRepository;
import to.game.util.Hex;

@ApplicationScoped
public class UserService {
    @Inject
    UserRepository userRepo;

    @Inject
    ChatRepository chatRepo;

    @Inject
    GameRepopsitory gameRepo;

    @Inject
    LikeRepository likeRepo;

    @Transactional
    public AccessTokenDTO createUser(String name, String password, Set<GameDTO> games) {
        MessageDigest digest;
        try {
            digest = MessageDigest.getInstance("SHA-256");
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not found", e);
        }

        if (userRepo.findByNameAndPassword(name,
                Hex.bytesToHex(digest.digest(password.getBytes(StandardCharsets.UTF_8)))).isPresent()) {
            throw new RuntimeException("User with this name already exists");
        }

        UserEntity user = new UserEntity();
        user.setName(name);
        user.setPassword(Hex.bytesToHex(digest.digest(password.getBytes(StandardCharsets.UTF_8))));

        for (GameDTO gameDTO : games) {
            GameEntity game = gameRepo.findByName(gameDTO.getName())
                    .orElseThrow(() -> new RuntimeException("Game not found"));
            user.addGame(game);
        }

        user.setAccessToken(UUID.randomUUID());
        userRepo.save(user);

        AccessTokenDTO token = new AccessTokenDTO();
        token.setAccessToken(user.getAccessToken());
        return token;
    }

    public AccessTokenDTO signIn(String name, String password) {
        MessageDigest digest;
        try {
            digest = MessageDigest.getInstance("SHA-256");
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Unknown hashing algorithm");
        }

        Optional<UserEntity> user = userRepo.findByNameAndPassword(name,
                Hex.bytesToHex(digest.digest(password.getBytes(StandardCharsets.UTF_8))));

        if (user.isEmpty()) {
            throw new RuntimeException("Invalid name or password");
        } else {
            AccessTokenDTO tokenDTO = new AccessTokenDTO();
            tokenDTO.setAccessToken(user.get().getAccessToken());
            return tokenDTO;
        }
    }

    @Transactional
    public void deleteUser(Long userId) {
        UserEntity user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        userRepo.delete(user);
    }

    @Transactional
    public void joinChat(Long userId, Long chatId) {
        UserEntity user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new RuntimeException("Chat not found"));
        user.addChat(chat);
    }

    @Transactional
    public void leaveChat(Long userId, Long chatId) {
        UserEntity user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new RuntimeException("Chat not found"));
        user.deleteChat(chat);
    }

    @Transactional
    public void addGame(Long userId, String gameName) {
        UserEntity user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        GameEntity game = gameRepo.findByName(gameName).orElseThrow(() -> new RuntimeException("Game not found"));
        user.addGame(game);
    }

    @Transactional
    public void deleteGame(Long userId, String gameName) {
        UserEntity user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        GameEntity game = gameRepo.findByName(gameName).orElseThrow(() -> new RuntimeException("Game not found"));
        user.deleteGame(game);
    }

    @Transactional
    public void setAvatar(Long userId, AvatarEntity avatar) {
        UserEntity user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.addAvatar(avatar);
    }

    @Transactional
    public void removeAvatar(Long userId) {
        UserEntity user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.deleteAvatar();
    }

    @Transactional
    public void joinRoom(Long userId, Long chatId, Long roomId) {
        UserEntity user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new RuntimeException("Chat not found"));
        user.setRoom(chat.getRooms().stream().filter(r -> r.getId().equals(roomId)).findFirst()
                .orElseThrow(() -> new RuntimeException("Room not found")));
    }

    @Transactional
    public void leaveRoom(Long userId) {
        UserEntity user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.deleteRoom();
    }

    @Transactional
    public void addFriend(Long userId, Long friendId) {
        UserEntity user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        UserEntity friend = userRepo.findById(friendId).orElseThrow(() -> new RuntimeException("Friend not found"));
        user.getFriends().add(friend);
        friend.getFriends().add(user);
    }

    @Transactional
    public void removeFriend(Long userId, Long friendId) {
        UserEntity user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        UserEntity friend = userRepo.findById(friendId).orElseThrow(() -> new RuntimeException("Friend not found"));
        user.getFriends().remove(friend);
        friend.getFriends().remove(user);
    }

    @Transactional
    public void sendLike(Long senderId, Long receiverId) {
        if (senderId.equals(receiverId)) {
            throw new RuntimeException("Users cannot like themselves");
        }

        Optional<LikeEntity> reverseLike = likeRepo.findBySenderIdAndReceiverId(receiverId, senderId);

        if (reverseLike.isPresent()) {
            likeRepo.delete(reverseLike.get());
            addFriend(senderId, receiverId);
            return;
        }

        UserEntity sender = userRepo.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        UserEntity receiver = userRepo.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        LikeEntity like = new LikeEntity();
        like.setSender(sender);
        like.setReceiver(receiver);

        likeRepo.save(like);
    }

    @Transactional
    public void changeName(Long userId, String newName) {
        UserEntity user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setName(newName);
    }

    @Transactional
    public void changeDescr(Long userId, String newDescr) {
        UserEntity user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setDescr(newDescr);
    }
}
