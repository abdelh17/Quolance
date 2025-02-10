package com.quolance.quolance_api.repositories;

import com.quolance.quolance_api.entities.UserConnectedAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConnectedAccountRepository extends JpaRepository<UserConnectedAccount, UUID> {
    Optional<UserConnectedAccount> findByProviderAndProviderId(String provider, String providerId);
}