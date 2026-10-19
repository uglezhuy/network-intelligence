package ru.networkintelligence.monitor.chat;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final ChatService chatService;

    public ChatWebSocketHandler(
            ChatService chatService) {

        this.chatService = chatService;

    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        chatService.addSession(session);
    }

    @Override
    // protected void handleTextMessage(
    // WebSocketSession session,
    // TextMessage message) {

    // String text = message.getPayload();

    // System.out.println("Получено сообщение: " + text);

    // chatService.sendMessage(text);
    // }
    // protected void handleTextMessage(
    // WebSocketSession session,
    // TextMessage message) {
    ////////////////////////////////////////////////////////
    // try {
    // ChatMessage chatMessage = objectMapper.readValue(
    // message.getPayload(),
    // ChatMessage.class);

    // System.out.println("Тип сообщения: " + chatMessage.getType());
    // System.out.println("Имя пользователя: " + chatMessage.getUsername());

    // } catch (com.fasterxml.jackson.core.JsonProcessingException exception) {
    // System.err.println("Не удалось прочитать JSON: " + exception.getMessage());
    // }
    // }
    protected void handleTextMessage(
            WebSocketSession session,
            TextMessage message) {

        String text = message.getPayload();

        // сохранено ли имя пользователя в сессии
        String username = (String) session.getAttributes().get("username");

        if (username == null || username.isBlank()) {
            if (text.isBlank()) {
                return;
            }
            username = text.trim(); // улалиение лишенго пробелов
            session.getAttributes().put("username", username);
            chatService.sendMessage("Ситема ", "Пользователь " + username + " подключился.");
            System.out.println("ИМя пользователя: " + username);

            String onlineUsers = chatService.getOnlineUsers();
            chatService.sendMessage("cистема", onlineUsers);
            return;
        } else {
            System.out.println(username + ": " + text);
            chatService.sendMessage(username, text);
        }

    }

    @Override
    public void afterConnectionClosed(
            WebSocketSession session,
            CloseStatus status) {

        chatService.removeSession(session);
        String onlineUsers = chatService.getOnlineUsers();
        chatService.sendMessage("cистема", onlineUsers);

    }

}