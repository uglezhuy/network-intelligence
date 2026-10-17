package ru.networkintelligence.monitor.chat;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final Set<WebSocketSession> sessions = ConcurrentHashMap.newKeySet();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.add(session);

        System.out.println(
                "Пользователь подключился: " + session.getId());
    }

    @Override
    protected void handleTextMessage(
            WebSocketSession session,
            TextMessage message) throws IOException {

        String text = message.getPayload();

        System.out.println("Получено сообщение: " + text);

        broadcast(text);
    }

    @Override
    public void afterConnectionClosed(
            WebSocketSession session,
            CloseStatus status) {
        sessions.remove(session);

        System.out.println(
                "Пользователь отключился: " + session.getId());
    }

    private void broadcast(String text) throws IOException {
        TextMessage message = new TextMessage(text);

        for (WebSocketSession session : sessions) {
            if (session.isOpen()) {
                session.sendMessage(message);
            }
        }
    }
}