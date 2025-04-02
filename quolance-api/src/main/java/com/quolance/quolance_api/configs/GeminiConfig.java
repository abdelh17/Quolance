package com.quolance.quolance_api.configs;

import lombok.Data;
import lombok.Setter;
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
    @Setter
    private String embeddingModelName;

    public void setModel(String model) {
        this.model = model;
        // Build baseUrl for content generation using the provided model
        this.baseUrl = "https://generativelanguage.googleapis.com/v1/models/" + model + ":generateContent";
    }

    /**
     * Returns the base URL for embedding calls using the embedding model name.
     */
    public String getEmbeddingBaseUrl() {
        return "https://generativelanguage.googleapis.com/v1beta/models/" + embeddingModelName + ":embedContent";
    }

    @Bean
    public WebClient geminiWebClient() {
        return WebClient.builder()
                .defaultHeader("Content-Type", "application/json")
                .build();
    }
}