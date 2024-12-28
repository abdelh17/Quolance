package com.quolance.quolance_api.configs;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    /**
     * Configures the message broker for the WebSocket application.
     * - Sets the application destination prefix to "/app", used for messages from client to server.
     * - Enables a simple message broker with the prefix "/topic", used for broadcasting messages from server to clients.
     *
     * @param config the message broker registry to configure.
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.setApplicationDestinationPrefixes("/app"); // Prefix for incoming messages
        config.enableSimpleBroker("/topic"); // Prefix for broadcasting messages
    }

    /**
     * Registers STOMP endpoints for WebSocket connections.
     * - Adds a WebSocket endpoint at "/ws".
     * - Allows fallback to SockJS for clients that do not support native WebSocket.
     * - Configures CORS to allow connections from specified frontend origins.
     *
     * @param registry the registry to register STOMP endpoints.
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws") // Main WebSocket endpoint
                .setAllowedOrigins("http://localhost:3000", "http://localhost:5173", "http://localhost:8080");
                //.withSockJS(); // Fallback to SockJS TODO: Fix SockJS not working with postman, enable in DEV environment
    }

    /**
     * Configures interceptors for client inbound messages.
     * - Adds a security interceptor to validate that the user is authenticated.
     * - Throws a SecurityException if the user is unauthenticated, preventing message processing.
     *
     * @param registration the channel registration for configuring interceptors.
     */
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, org.springframework.messaging.MessageChannel channel) {
                // Retrieve the authentication from the security context
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                // Ensure the user is authenticated
                if (authentication == null || !authentication.isAuthenticated()) {
                    throw new SecurityException("Unauthenticated WebSocket access");
                }

                // Allow the message to proceed if authenticated
                return message;
            }
        });
    }
}
