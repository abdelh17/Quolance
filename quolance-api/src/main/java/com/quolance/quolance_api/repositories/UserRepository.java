package com.quolance.quolance_api.repositories;

import com.quolance.quolance_api.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findById(Long id);

    Optional<User> findByUsername(String username);

    boolean existsByEmail(String email);

    List<User> findAll(); // Added for email uniqueness check
}
