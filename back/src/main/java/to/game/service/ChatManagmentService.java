package to.game.service;

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

@ApplicationScoped
public class ChatManagmentService {
    @Inject
    ChatRepository chatRepo;

    @Inject
    UserService userRepo;

    @Transactional
    public ResponseDTO<Object> createChat(Long userId, String chatName, String chatDescr) {
        ChatEntity chat = new ChatEntity();
        chat.setName(chatName);
        chat.setDescr(chatDescr);
        chat.setOwner(userRepo.userRepo.findById(userId).orElseThrow(() -> new EntityNotFoundException("User")));
        chatRepo.save(chat);
        return new ResponseDTO<>(200);
    }

    @Transactional
    public ResponseDTO<Object> deleteChat(Long chatId, Long userId) {
        if (checkIfOwner(chatId, userId)) {
            ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));
            chatRepo.delete(chat);
            return new ResponseDTO<>(200);
        } else
            throw new DataConsistencyException("User is not owner of this chat");
    }

    @Transactional
    public ResponseDTO<Object> addRoomToChat(Long chatId, Long userId, String roomName) {
        if (checkIfOwner(chatId, userId)) {
            ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));

            RoomEntity room = new RoomEntity();
            room.setName(roomName);

            chat.addRoom(room);

            return new ResponseDTO<>(200);
        } else
            throw new DataConsistencyException("User is not owner of this chat");
    }

    @Transactional
    public ResponseDTO<Object> deleteRoomFromChat(Long chatId, Long userId, Long roomId) {
        if (checkIfOwner(chatId, userId)) {
            ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));

            RoomEntity room = chat.getRooms().stream().filter(r -> r.getId() == roomId).findFirst()
                    .orElseThrow(() -> new EntityNotFoundException("Room"));

            chat.deleteRoom(room);
            return new ResponseDTO<>(200);
        } else
            throw new DataConsistencyException("User is not owner of this chat");

    }

    @Transactional
    public ResponseDTO<Object> renameChat(Long chatId, Long userId, String newName) {
        if (checkIfOwner(chatId, userId)) {
            ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));
            chat.setName(newName);
            return new ResponseDTO<>(200);
        } else
            throw new DataConsistencyException("User is not owner of this chat");

    }

    @Transactional
    public ResponseDTO<Object> changeDescr(Long chatId, Long userId, String newDscription) {
        if (checkIfOwner(chatId, userId)) {
            ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));
            chat.setDescr(newDscription);
            return new ResponseDTO<>(200);
        } else
            throw new DataConsistencyException("User is not owner of this chat");

    }

    @Transactional
    public boolean checkIfOwner(Long chatId, Long userId) {
        ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));
        if (chat.getOwner().getId() != userId) {
            throw new DataConnectionException("User is not the owner of the chat");
        }
        return true;
    }

    @Transactional
    public ResponseDTO<Object> sendMessage(Long senderId, Long chatId, String content) {
        ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));
        UserEntity sender = userRepo.userRepo.findById(senderId)
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
