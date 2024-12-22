package com.quolance.quolance_api.configs;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@TestConfiguration
@EnableMethodSecurity
public class TestSecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/login", "/api/users").permitAll()
                        .requestMatchers("/api/users/admin").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .securityContext(security -> security
                        .requireExplicitSave(false)
                )
                .sessionManagement(session -> session
                        .requireExplicitAuthenticationStrategy(false)
                );

        return http.build();
    }
}