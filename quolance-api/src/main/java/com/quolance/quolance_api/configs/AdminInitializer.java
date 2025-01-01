package com.quolance.quolance_api.configs;

import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.Role;
import com.quolance.quolance_api.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile("local")
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        logger.info("Checking if the admin user exists for email: {}", adminEmail);

        userRepository.findByEmail(adminEmail).ifPresentOrElse(
                admin -> logger.info("Admin user already exists..."),
                () -> {
                    logger.info("User not found. Creating admin user with email (username): {}", adminEmail);
                    userRepository.save(
                            User.builder()
                                    .firstName("Admin")
                                    .lastName("Admin")
                                    .email(adminEmail)
                                    .username("admin")
                                    .password(passwordEncoder.encode(adminPassword))
                                    .role(Role.ADMIN)
                                    .verified(true)
                                    .build()
                    );
                    logger.info("Admin user created with email (username): {}", adminEmail);
                }
        );
    }
}
