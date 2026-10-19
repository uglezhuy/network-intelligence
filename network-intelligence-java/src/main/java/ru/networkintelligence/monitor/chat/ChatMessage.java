package ru.networkintelligence.monitor.chat;

public class ChatMessage {

    private String type;
    private String username;
    private String text;

    public ChatMessage(String type, String username, String text) { // это пока не используется
        this.type = type;
        this.username = username;
        this.text = text;
    }

    public ChatMessage() {
        // Пустой конструктор нужен Jackson для создания объекта
        // при преобразовании JSON в ChatMessage.
        // После создания объекта Jackson заполнит поля type и username
        // с помощью сеттеров.
    }

    ///////////////////////////
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    //////////////////////////
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    ////////////////////////////////////
    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

}
