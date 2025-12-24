package to.game.service;

import java.util.List;

import jakarta.data.exceptions.DataConnectionException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import to.game.exceptions.EntityNotFoundException;
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
    public void createChat(Long userId, String chatName, String chatDescr) {
        ChatEntity chat = new ChatEntity();
        chat.setName(chatName);
        chat.setDescr(chatDescr);
        chat.setOwner(userRepo.userRepo.findById(userId).orElseThrow(() -> new EntityNotFoundException("User")));

        chatRepo.save(chat);
    }

    @Transactional
    public void deleteChat(Long chatId, Long userId) {
        checkIfOwner(chatId, userId);
        ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));
        chatRepo.delete(chat);
    }

    @Transactional
    public void addRoomToChat(Long chatId, Long userId, String roomName) {
        checkIfOwner(chatId, userId);
        ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));

        RoomEntity room = new RoomEntity();
        room.setName(roomName);

        chat.addRoom(room);
    }

    @Transactional
    public void deleteRoomFromChat(Long chatId, Long userId, Long roomId) {
        checkIfOwner(chatId, userId);
        ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));

        RoomEntity room = chat.getRooms().stream().filter(r -> r.getId() == roomId).findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Room"));

        chat.deleteRoom(room);
    }

    @Transactional
    public void renameChat(Long chatId, Long userId, String newName) {
        checkIfOwner(chatId, userId);
        ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));
        chat.setName(newName);
    }

    @Transactional
    public void changeDescr(Long chatId, Long userId, String newDscription) {
        checkIfOwner(chatId, userId);
        ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));
        chat.setDescr(newDscription);
    }

    @Transactional
    public void checkIfOwner(Long chatId, Long userId) {
        ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));
        if (chat.getOwner().getId() != userId) {
            throw new DataConnectionException("User is not the owner of the chat");
        }
    }

    @Transactional
    public void sendMessage(Long senderId, Long chatId, String content) {
        ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));
        UserEntity sender = userRepo.userRepo.findById(senderId)
                .orElseThrow(() -> new EntityNotFoundException("User"));
        MessageEntity message = new MessageEntity();
        message.setChatId(chat);
        message.setSenderId(sender);
        message.setContent(content);
        chat.addMessage(message);
    }

    @Transactional
    public List<MessageEntity> getMessages(Long chatId) {
        ChatEntity chat = chatRepo.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat"));
        return chat.getMessages();
    }
}
