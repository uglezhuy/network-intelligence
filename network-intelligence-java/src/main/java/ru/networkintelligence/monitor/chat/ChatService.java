package ru.networkintelligence.monitor.chat;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

@Service
public class ChatService {

    private final Set<WebSocketSession> sessions = ConcurrentHashMap.newKeySet();

    public void addSession(WebSocketSession session) {
        sessions.add(session);

        System.out.println(
                "Пользователь подключился: " + session.getId());
    }

    public void removeSession(WebSocketSession session) {
        sessions.remove(session);

        System.out.println(
                "Пользователь отключился: " + session.getId());
    }

    public void sendMessage(String text) {
        TextMessage message = new TextMessage(text);

        for (WebSocketSession session : sessions) {
            if (!session.isOpen()) {
                sessions.remove(session);
                continue;
            }

            try {
                session.sendMessage(message);
            } catch (IOException exception) {
                System.err.println(
                        "Не удалось отправить сообщение: "
                                + exception.getMessage());
            }
        }
    }

    public int getOnlineCount() {
        return sessions.size();
    }
}