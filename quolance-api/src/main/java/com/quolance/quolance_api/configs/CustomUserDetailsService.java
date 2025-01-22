package com.quolance.quolance_api.configs;

import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        // Try to find user by email first
        Optional<User> userByEmail = userRepository.findByEmail(login);
        if (userByEmail.isPresent()) {
            return userByEmail.get();
        }

        // If not found by email, try username
        Optional<User> userByUsername = userRepository.findByUsername(login);
        if (userByUsername.isPresent()) {
            return userByUsername.get();
        }

        throw new UsernameNotFoundException("User not found with email or username: " + login);
    }
}
