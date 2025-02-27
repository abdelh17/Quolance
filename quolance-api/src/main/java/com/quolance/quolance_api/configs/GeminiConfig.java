package com.quolance.quolance_api.configs;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
@ConfigurationProperties(prefix = "google.api")
@Data
public class GeminiConfig {
    private String key;
    private String model;
    private String baseUrl;

    public void setModel(String model) {
        this.model = model;
        this.baseUrl = "https://generativelanguage.googleapis.com/v1/models/" + model + ":generateContent";
    }
    @Bean
    public WebClient geminiWebClient() {
        return WebClient.builder()
                .defaultHeader("Content-Type", "application/json")
                .build();
    }
}