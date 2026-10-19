package ru.networkintelligence.monitor.chat;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ChatConfig {

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}