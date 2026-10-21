package ru.networkintelligence.monitor.chat;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;


import com.fasterxml.jackson.databind.JsonNode;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {



    private final ChatService chatService;
    private final ObjectMapper objectMapper;
    public ChatWebSocketHandler(
            ChatService chatService, ObjectMapper objectMapper) {

        this.chatService = chatService;
        this.objectMapper = objectMapper;

    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        chatService.addSession(session);
    }

    @Override

    protected void handleTextMessage(
            WebSocketSession session,
            TextMessage message) {

        String text = message.getPayload();

        JsonNode json;

        try {
            json = objectMapper.readTree(text);
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            System.out.println("Некорректный JSON: " + e.getMessage());
            return;
        }

        String type = json.path("type").asText();
        String body = json.path("body").asText();


        //          сохранено ли имя пользователя в сессии
        String username = (String) session.getAttributes().get("username");
        if ("login".equals(type)) {
            if (body.isBlank()) {
                return;
            }

            username = body.trim();
            session.getAttributes().put("username", username);

            chatService.sendMessage(
                    "Система",
                    "Пользователь " + username + " подключился."
            );

            System.out.println("Имя пользователя: " + username);

            String onlineUsers = chatService.getOnlineUsers();
            chatService.sendMessage("Система", onlineUsers);
            return;
        }

        if (username == null || username.isBlank()) {
            System.out.println("Сначала необходимо войти в чат");
            return;
        }

        if ("message".equals(type)) {
            System.out.println(username + ": " + body);

            chatService.sendMessage(username, body);
        }
        if ("typing".equals(type)) {
            boolean isTyping = Boolean.parseBoolean(body);

            if (isTyping) {
                System.out.println(username + " печатает...");

                chatService.sendMessage("Печатает", username);
            } else {
                System.out.println(username + " перестал печатать.");
                chatService.sendMessage("Перестал печатать", username);


            }

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