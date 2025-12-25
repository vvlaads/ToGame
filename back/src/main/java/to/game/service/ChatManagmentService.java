package to.game.service;

import java.util.UUID;

import jakarta.data.exceptions.DataConnectionException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import to.game.exceptions.DataConsistencyException;
import to.game.exceptions.EntityNotFoundException;
import to.game.model.dto.ResponseDTO;
import to.game.model.entity.ChatEntity;
import to.game.model.entity.MessageEntity;
import to.game.model.entity.RoomEntity;
import to.game.model.entity.UserEntity;
import to.game.model.repos.ChatRepository;
import to.game.model.repos.UserRepository;

@ApplicationScoped
public class ChatManagmentService {
    @Inject
    ChatRepository chatRepo;

    @Inject
    UserRepository userRepo;

    @Transactional
    public ResponseDTO<Object> createChat(UUID accessToken, String chatName, String chatDescr) {
        ChatEntity chat = new ChatEntity();
        chat.setName(chatName);
        chat.setDescr(chatDescr);
        chat.setOwner(userRepo.findByAccessToken(accessToken)
                .orElseThrow(() -> new EntityNotFoundException("User")));
        chatRepo.save(chat);
        return new ResponseDTO<>(200);
    }

    @Transactional
    public ResponseDTO<Object> deleteChat(Long chatId, UUID accessToken) {
        if (checkIfOwner(chatId, accessToken)) {
            ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));
            chatRepo.delete(chat);
            return new ResponseDTO<>(200);
        } else
            throw new DataConsistencyException("User is not owner of this chat");
    }

    @Transactional
    public ResponseDTO<Object> addRoomToChat(Long chatId, UUID accessToken, String roomName) {
        if (checkIfOwner(chatId, accessToken)) {
            ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));

            RoomEntity room = new RoomEntity();
            room.setName(roomName);

            chat.addRoom(room);

            return new ResponseDTO<>(200);
        } else
            throw new DataConsistencyException("User is not owner of this chat");
    }

    @Transactional
    public ResponseDTO<Object> deleteRoomFromChat(Long chatId, UUID accessToken, Long roomId) {
        if (checkIfOwner(chatId, accessToken)) {
            ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));

            RoomEntity room = chat.getRooms().stream().filter(r -> r.getId() == roomId).findFirst()
                    .orElseThrow(() -> new EntityNotFoundException("Room"));

            chat.deleteRoom(room);
            return new ResponseDTO<>(200);
        } else
            throw new DataConsistencyException("User is not owner of this chat");

    }

    @Transactional
    public ResponseDTO<Object> renameChat(Long chatId, UUID accessToken, String newName) {
        if (checkIfOwner(chatId, accessToken)) {
            ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));
            chat.setName(newName);
            return new ResponseDTO<>(200);
        } else
            throw new DataConsistencyException("User is not owner of this chat");

    }

    @Transactional
    public ResponseDTO<Object> changeDescr(Long chatId, UUID accessToken, String newDscription) {
        if (checkIfOwner(chatId, accessToken)) {
            ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));
            chat.setDescr(newDscription);
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
        ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));
        UserEntity sender = userRepo.findByAccessToken(accessToken)
                .orElseThrow(() -> new EntityNotFoundException("User"));
        MessageEntity message = new MessageEntity();
        message.setChatId(chat);
        message.setSenderId(sender);
        message.setContent(content);
        chat.addMessage(message);
        return new ResponseDTO<>(200);
    }

    @Transactional
    public ResponseDTO<MessageEntity> getMessages(Long chatId) {
        ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));
        return new ResponseDTO<>(200, "", chat.getMessages());
    }
}
