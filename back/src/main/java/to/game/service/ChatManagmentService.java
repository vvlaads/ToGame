package to.game.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import jakarta.data.exceptions.DataConnectionException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import to.game.exceptions.DataConsistencyException;
import to.game.exceptions.EntityNotFoundException;
import to.game.model.dto.MessageDTO;
import to.game.model.dto.ResponseDTO;
import to.game.model.dto.RoomDTO;
import to.game.model.dto.UserDTO;
import to.game.model.entity.ChatEntity;
import to.game.model.entity.MessageEntity;
import to.game.model.entity.RoomEntity;
import to.game.model.entity.UserEntity;
import to.game.model.repos.ChatRepository;
import to.game.model.repos.MessageRepository;
import to.game.model.repos.RoomRepository;
import to.game.model.repos.UserRepository;

@ApplicationScoped
public class ChatManagmentService {
    @Inject
    ChatRepository chatRepo;

    @Inject
    UserRepository userRepo;

    @Inject
    RoomRepository roomRepo;

    @Inject
    MessageRepository messageRepo;

    @Transactional
    public ResponseDTO<Object> createChat(UUID accessToken, String chatName, String chatDescr, String chatFilepath, Set<UserDTO> users) {
        UserEntity user = userRepo.findByAccessTokenWithChats(accessToken)
                .orElseThrow(() -> new EntityNotFoundException("User"));
        ChatEntity chat = new ChatEntity();
        chat.setName(chatName);
        chat.setDescr(chatDescr);
        chat.setOwner(user);
        chat.setFilepath(chatFilepath);
        chatRepo.save(chat);
        user.addChat(chat);
        userRepo.update(user);
        users.forEach(u -> {
            UserEntity member = userRepo.findByIdWithChats(u.getId()).get();
            member.getChats().add(chat);
            userRepo.update(member);
        });
        return new ResponseDTO<>(200);
    }

    @Transactional
    public ResponseDTO<Object> deleteChat(Long chatId, UUID accessToken) {
        if (checkIfOwner(chatId, accessToken)) {
            ChatEntity chat = chatRepo.findByIdWithUsers(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));
            for (UserEntity userRef : chat.getUsers()) {
                UserEntity user = userRepo.findByIdWithChats(userRef.getId())
                        .orElseThrow(() -> new EntityNotFoundException("User"));
                user.getChats().removeIf(c -> c.getId().equals(chat.getId()));
                userRepo.update(user);
            }
            chat.getUsers().clear();
            chatRepo.delete(chat);
            return new ResponseDTO<>(200);
        } else
            throw new DataConsistencyException("User is not owner of this chat");
    }

    @Transactional
    public ResponseDTO<Object> addUser(Long chatId, Long userId) {
        UserEntity user = userRepo.findByIdWithChats(userId).orElseThrow(() -> new EntityNotFoundException("User"));
        ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));
        user.getChats().add(chat);
        userRepo.update(user);
        return new ResponseDTO<>(200);
    }

    @Transactional
    public ResponseDTO<Object> addRoomToChat(Long chatId, UUID accessToken, String roomName) {
        if (checkIfOwner(chatId, accessToken)) {
            ChatEntity chat = chatRepo.findByIdWithRooms(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));

            RoomEntity room = new RoomEntity();
            room.setName(roomName);
            room.setChat(chat);
            roomRepo.save(room);

            chat.addRoom(room);
            chatRepo.update(chat);

            return new ResponseDTO<>(200);
        } else
            throw new DataConsistencyException("User is not owner of this chat");
    }

    @Transactional
    public ResponseDTO<Object> deleteRoomFromChat(Long chatId, UUID accessToken, Long roomId) {
        if (checkIfOwner(chatId, accessToken)) {
            ChatEntity chat = chatRepo.findByIdWithRooms(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));

            RoomEntity room = chat.getRooms().stream().filter(r -> r.getId() == roomId).findFirst()
                    .orElseThrow(() -> new EntityNotFoundException("Room"));

            chat.deleteRoom(room);
            chatRepo.update(chat);
            roomRepo.delete(room);
            return new ResponseDTO<>(200);
        } else
            throw new DataConsistencyException("User is not owner of this chat");

    }

    @Transactional
    public ResponseDTO<Object> renameChat(Long chatId, UUID accessToken, String newName) {
        if (checkIfOwner(chatId, accessToken)) {
            ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));
            chat.setName(newName);
            chatRepo.update(chat);
            return new ResponseDTO<>(200);
        } else
            throw new DataConsistencyException("User is not owner of this chat");

    }

    @Transactional
    public ResponseDTO<Object> changeDescr(Long chatId, UUID accessToken, String newDscription) {
        if (checkIfOwner(chatId, accessToken)) {
            ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));
            chat.setDescr(newDscription);
            chatRepo.update(chat);
            return new ResponseDTO<>(200);
        } else
            throw new DataConsistencyException("User is not owner of this chat");

    }

    @Transactional
    public ResponseDTO<Object> changeFilepath(Long chatId, UUID accessToken, String newFilepath) {
        if (checkIfOwner(chatId, accessToken)) {
            ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));
            chat.setFilepath(newFilepath);
            chatRepo.update(chat);
            return new ResponseDTO<>(200);
        } else
            throw new DataConsistencyException("User is not owner of this chat");

    }

    @Transactional
    public boolean checkIfOwner(Long chatId, UUID accessToken) {
        ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));
        UserEntity user = userRepo.findByAccessToken(accessToken)
                .orElseThrow(() -> new EntityNotFoundException("User"));
        if (chat.getOwner().getId() != user.getId()) {
            throw new DataConnectionException("User is not the owner of the chat");
        }
        return true;
    }

    @Transactional
    public ResponseDTO<Object> sendMessage(UUID accessToken, Long chatId, String content) {
        ChatEntity chat = chatRepo.findByIdWithMessages(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));
        UserEntity sender = userRepo.findByAccessToken(accessToken)
                .orElseThrow(() -> new EntityNotFoundException("User"));
        MessageEntity message = new MessageEntity();
        message.setChatId(chat);
        message.setSenderId(sender);
        message.setContent(content);
        messageRepo.save(message);
        chat.addMessage(message);
        chatRepo.update(chat);
        return new ResponseDTO<>(200);
    }

    @Transactional
    public ResponseDTO<MessageDTO> getMessages(Long chatId) {
        List<MessageDTO> messages = new ArrayList<>();
        for (MessageEntity message : messageRepo.findByChatIdWithUsers(chatId)) {
            messages.add(new MessageDTO(message));
        }
        return new ResponseDTO<>(200, "", messages);
    }

    @Transactional
    public ResponseDTO<UserDTO> getUsers(Long chatId) {
        List<UserDTO> users = new ArrayList<>();
        for (UserEntity user : chatRepo.findByIdWithUsers(chatId).get().getUsers()) {
            users.add(new UserDTO(user.getId(), user.getName(), user.getDescr()));
        }
        return new ResponseDTO<>(200, "", users);
    }

    @Transactional
    public ResponseDTO<RoomDTO> getRooms(Long chatId) {
        List<RoomDTO> rooms = new ArrayList<>();
        for (RoomEntity room : chatRepo.findByIdWithRooms(chatId).get().getRooms()) {
            rooms.add(new RoomDTO(room));
        }
        return new ResponseDTO<>(200, "", rooms);
    }

    @Transactional
    public ResponseDTO<UserDTO> getUsersInRoom(Long roomId) {
        List<UserDTO> users = new ArrayList<>();
        for (UserEntity user : userRepo.findByRoomId(roomId)) {
            users.add(new UserDTO(user.getId(), user.getName(), user.getDescr()));
        }
        return new ResponseDTO<>(200, "", users);
    }
}
