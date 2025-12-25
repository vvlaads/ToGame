package to.game.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import to.game.exceptions.AuthorizationException;
import to.game.exceptions.DataConsistencyException;
import to.game.exceptions.EntityNotFoundException;
import to.game.model.dto.AccessTokenDTO;
import to.game.model.dto.GameDTO;
import to.game.model.dto.ResponseDTO;
import to.game.model.dto.UserDTO;
import to.game.model.entity.AvatarEntity;
import to.game.model.entity.ChatEntity;
import to.game.model.entity.GameEntity;
import to.game.model.entity.LikeEntity;
import to.game.model.entity.UserEntity;
import to.game.model.repos.AvatarRepository;
import to.game.model.repos.ChatRepository;
import to.game.model.repos.GameRepository;
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
    GameRepository gameRepo;

    @Inject
    LikeRepository likeRepo;

    @Inject
    AvatarRepository avatarRepo;

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
            throw new DataConsistencyException("User with this name already exists");
        }

        UserEntity user = new UserEntity();
        user.setName(name);
        user.setPassword(Hex.bytesToHex(digest.digest(password.getBytes(StandardCharsets.UTF_8))));

        for (GameDTO gameDTO : games) {
            GameEntity game = gameRepo.findByName(gameDTO.getName())
                    .orElseThrow(() -> new EntityNotFoundException("Game"));
            user.addGame(game);
        }

        user.setAccessToken(UUID.randomUUID());
        userRepo.save(user);

        AccessTokenDTO token = new AccessTokenDTO();
        token.setAccessToken(user.getAccessToken());
        return token;
    }

    @Transactional
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
            throw new AuthorizationException("Invalid name or password");
        } else {
            AccessTokenDTO tokenDTO = new AccessTokenDTO();
            tokenDTO.setAccessToken(user.get().getAccessToken());
            return tokenDTO;
        }
    }

    @Transactional
    public ResponseDTO<Object> deleteUser(UUID accessToken) {
        UserEntity user = userRepo.findByAccessToken(accessToken)
                .orElseThrow(() -> new EntityNotFoundException("User"));
        userRepo.delete(user);
        return new ResponseDTO<>(200);
    }

    @Transactional
    public ResponseDTO<UserDTO> userInfo(UUID accessToken) {
        UserEntity user = userRepo.findByAccessToken(accessToken)
                .orElseThrow(() -> new EntityNotFoundException("User"));
        UserDTO userDTO = new UserDTO(user);
        return new ResponseDTO<>(200, "", List.of(userDTO));
    }

    @Transactional
    public ResponseDTO<UserDTO> userInfoById(Long userId) {
        UserEntity user = userRepo.findById(userId).orElseThrow(() -> new EntityNotFoundException("User"));
        UserDTO userDTO = new UserDTO(user);
        return new ResponseDTO<>(200, "", List.of(userDTO));
    }

    @Transactional
    public ResponseDTO<Object> joinChat(UUID accessToken, Long chatId) {
        UserEntity user = userRepo.findByAccessToken(accessToken)
                .orElseThrow(() -> new EntityNotFoundException("User"));
        ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));
        user.addChat(chat);
        return new ResponseDTO<>(200);
    }

    @Transactional
    public ResponseDTO<Object> leaveChat(UUID accessToken, Long chatId) {
        UserEntity user = userRepo.findByAccessToken(accessToken)
                .orElseThrow(() -> new EntityNotFoundException("User"));
        ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));
        user.deleteChat(chat);
        return new ResponseDTO<>(200);
    }

    @Transactional
    public ResponseDTO<Object> addGame(Long userId, String gameName) {
        UserEntity user = userRepo.findById(userId).orElseThrow(() -> new EntityNotFoundException("User"));
        GameEntity game = gameRepo.findByName(gameName).orElseThrow(() -> new EntityNotFoundException("Game"));
        user.addGame(game);
        return new ResponseDTO<>(200);
    }

    @Transactional
    public ResponseDTO<Object> deleteGame(Long userId, String gameName) {
        UserEntity user = userRepo.findById(userId).orElseThrow(() -> new EntityNotFoundException("User"));
        GameEntity game = gameRepo.findByName(gameName).orElseThrow(() -> new EntityNotFoundException("Game"));
        user.deleteGame(game);
        return new ResponseDTO<>(200);
    }

    @Transactional
    public ResponseDTO<Object> setAvatar(UUID accessToken, Long avatarId) {
        UserEntity user = userRepo.findByAccessToken(accessToken)
                .orElseThrow(() -> new EntityNotFoundException("User"));
        AvatarEntity avatar = avatarRepo.findById(avatarId).orElseThrow(() -> new EntityNotFoundException("Avatar"));
        user.addAvatar(avatar);
        return new ResponseDTO<>(200);
    }

    @Transactional
    public ResponseDTO<Object> removeAvatar(UUID accessToken) {
        UserEntity user = userRepo.findByAccessToken(accessToken)
                .orElseThrow(() -> new EntityNotFoundException("User"));
        user.deleteAvatar();
        return new ResponseDTO<>(200);
    }

    @Transactional
    public ResponseDTO<Object> joinRoom(UUID accessToken, Long chatId, Long roomId) {
        UserEntity user = userRepo.findByAccessToken(accessToken)
                .orElseThrow(() -> new EntityNotFoundException("User"));
        ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));
        user.setRoom(chat.getRooms().stream().filter(r -> r.getId().equals(roomId)).findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Room")));
        return new ResponseDTO<>(200);
    }

    @Transactional
    public ResponseDTO<Object> leaveRoom(UUID accessToken) {
        UserEntity user = userRepo.findByAccessToken(accessToken)
                .orElseThrow(() -> new EntityNotFoundException("User"));
        user.deleteRoom();
        return new ResponseDTO<>(200);
    }

    @Transactional
    public ResponseDTO<Object> addFriend(UUID accessToken, Long friendId) {
        UserEntity user = userRepo.findByAccessToken(accessToken)
                .orElseThrow(() -> new EntityNotFoundException("User"));
        UserEntity friend = userRepo.findById(friendId).orElseThrow(() -> new EntityNotFoundException("Friend"));
        user.getFriends().add(friend);
        friend.getFriends().add(user);
        return new ResponseDTO<>(200);
    }

    @Transactional
    public ResponseDTO<Object> removeFriend(UUID accessToken, Long friendId) {
        UserEntity user = userRepo.findByAccessToken(accessToken)
                .orElseThrow(() -> new EntityNotFoundException("User"));
        UserEntity friend = userRepo.findById(friendId).orElseThrow(() -> new EntityNotFoundException("Friend"));
        user.getFriends().remove(friend);
        friend.getFriends().remove(user);
        return new ResponseDTO<>(200);
    }

    @Transactional
    public ResponseDTO<UserEntity> getFriends(UUID accessToken) {
        UserEntity user = userRepo.findByAccessToken(accessToken)
                .orElseThrow(() -> new EntityNotFoundException("User"));
        return new ResponseDTO<>(200, "", user.getFriends().stream().toList());
    }

    @Transactional
    public ResponseDTO<Object> sendLike(UUID accessToken, Long receiverId) {
        UserEntity sender = userRepo.findByAccessToken(accessToken)
                .orElseThrow(() -> new EntityNotFoundException("Sender"));

        UserEntity receiver = userRepo.findById(receiverId)
                .orElseThrow(() -> new EntityNotFoundException("Receiver"));

        if (sender.getId().equals(receiverId)) {
            throw new DataConsistencyException("Users cannot like themselves");
        }

        Optional<LikeEntity> reverseLike = likeRepo.findBySenderIdAndReceiverId(receiverId, sender.getId());

        if (reverseLike.isPresent()) {
            likeRepo.delete(reverseLike.get());
            return addFriend(accessToken, receiverId);
        }

        LikeEntity like = new LikeEntity();
        like.setSenderId(sender);
        like.setReceiverId(receiver);

        likeRepo.save(like);
        return new ResponseDTO<>(200);
    }

    @Transactional
    public ResponseDTO<LikeEntity> getRecievedLikes(UUID accessToken) {
        UserEntity user = userRepo.findByAccessToken(accessToken)
                .orElseThrow(() -> new EntityNotFoundException("User"));
        return new ResponseDTO<>(200, "", user.getReceivedLikes().stream().toList());
    }

    @Transactional
    public ResponseDTO<LikeEntity> getSentLikes(UUID accessToken) {
        UserEntity user = userRepo.findByAccessToken(accessToken)
                .orElseThrow(() -> new EntityNotFoundException("User"));
        return new ResponseDTO<>(200, "", user.getSentLikes().stream().toList());
    }

    @Transactional
    public ResponseDTO<Object> changeName(UUID accessToken, String newName) {
        UserEntity user = userRepo.findByAccessToken(accessToken)
                .orElseThrow(() -> new EntityNotFoundException("User"));
        user.setName(newName);
        return new ResponseDTO<>(200);
    }

    @Transactional
    public ResponseDTO<Object> changeDescr(UUID accessToken, String newDescr) {
        UserEntity user = userRepo.findByAccessToken(accessToken)
                .orElseThrow(() -> new EntityNotFoundException("User"));
        user.setDescr(newDescr);
        return new ResponseDTO<>(200);
    }
}
