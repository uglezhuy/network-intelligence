package ru.networkintelligence.monitor.chat;

import java.util.Map;
import java.util.concurrent.ScheduledFuture;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

@Service
public class ChatService {

    private final Set<WebSocketSession> sessions = ConcurrentHashMap.newKeySet();

    // private final Map<WebSocketSession, ScheduledFuture<?>> typingTimers = new
    // ConcurrentHashMap<>();

    public void addSession(WebSocketSession session) {
        sessions.add(session);

        System.out.println(
                "Пользователь подключился: " + session.getId());
    }

    public void removeSession(WebSocketSession session) {
        String username = (String) session.getAttributes().get("username");
        sessions.remove(session);

        System.out.println(
                "Пользователь отключился:  айди сесии " + session.getId() + "Имя пользователя "
                        + username);

        sendMessage(username, "Пользователь отключился");
        System.out.println("Обновленный онлайн " + getOnlineCount());

    }

    public void sendMessage(String username, String text) {
        String fullMasege = "[" + username + "]: " + text;

        TextMessage message = new TextMessage(fullMasege);

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
        }
    }

    public int getOnlineCount() {
        return sessions.size();
    }

    public String getOnlineUsers() {
        String onlineUsers = "Пользователи онлайн: ";
        for (WebSocketSession session : sessions) {
            String name = (String) session.getAttributes().get("username");
            onlineUsers += name + ",";
        }
        return onlineUsers;

    }

}