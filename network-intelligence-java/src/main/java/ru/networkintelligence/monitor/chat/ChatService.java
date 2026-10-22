package ru.networkintelligence.monitor.chat;

import java.util.Map;

import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;




@Service
public class ChatService {

    private final Set<WebSocketSession> sessions = ConcurrentHashMap.newKeySet();


    private final ObjectMapper objectMapper;

    public ChatService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }
    // private final Map<WebSocketSession, ScheduledFuture<?>> typingTimers = new
    // ConcurrentHashMap<>();

    public void addSession(WebSocketSession session) {
        sessions.add(session);

        System.out.println(
                "Пользователь подключился: " + session.getId());


        List<String> fullSessions = sessions.stream()
                .filter(WebSocketSession::isOpen)
                .map(WebSocketSession::getId)
                .collect(Collectors.toList());






        try {
            String json = objectMapper.writeValueAsString(
                    Map.of(
                            "type", "sessionConnected",
                            "body", fullSessions
                    )
            );

            TextMessage message = new TextMessage(json);
            sendMessage2(message);

        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            System.err.println(e.getMessage());
        }
    }

    public void removeSession(WebSocketSession session) {
        String username = (String) session.getAttributes().get("username");
        sessions.remove(session);

        System.out.println(
                "Пользователь отключился:  айди сесии " + session.getId() + "Имя пользователя "
                        + username);

        sendMessage(username, "Пользователь отключился");


    }


    public void sendMessage2(TextMessage message) {
        for (WebSocketSession session : sessions) {
            if (!session.isOpen()) {
                removeSession(session);
                continue;
            }

            try {
                session.sendMessage(message);
            } catch (IOException exception) {
                System.err.println(
                        "Не удалось отправить сообщение: "
                                + exception.getMessage());
            }
            System.out.println("Сенд меседж 2 "+message);
        }
    }


    public void sendMessage(String username, String text) {
        String fullMasege = "[" + username + "]: " + text;


        try {
            String json = objectMapper.writeValueAsString(
                    Map.of(
                            "type", "message",
                            "body", fullMasege
                    )
            );

            sendMessage2(new TextMessage(json));

        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            System.err.println(e.getMessage());
        }



//        for (WebSocketSession session : sessions) {
//            if (!session.isOpen()) {
//                removeSession(session);
//                continue;
//            }
//
//            try {
//                session.sendMessage(message);
//            } catch (IOException exception) {
//                System.err.println(
//                        "Не удалось отправить сообщение: "
//                                + exception.getMessage());
//            }
//        }
    }

////////////////////////////////////////////         для авторизованных пользователей
    public void sendOnlineUsers() {
        List<String>  fullAutorizUsers=sessions.stream()
                .filter(WebSocketSession::isOpen)
                .map(session ->
                        (String) session.getAttributes().get("username"))
                .filter(username ->
                        username != null && !username.isBlank())
                .collect(Collectors.toList());

        try {
            String json = objectMapper.writeValueAsString(
                    Map.of(
                            "type", "onlineUsers",
                            "body", fullAutorizUsers
                    )
            );

            sendMessage2(new TextMessage(json));

        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            System.err.println(e.getMessage());
        }
    }
///////////////////////////////////////////////////////////
}