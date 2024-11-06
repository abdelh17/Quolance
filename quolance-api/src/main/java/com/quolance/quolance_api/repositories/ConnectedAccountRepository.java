package com.quolance.quolance_api.repositories;

import com.quolance.quolance_api.entities.UserConnectedAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConnectedAccountRepository extends JpaRepository<UserConnectedAccount, Long> {
    Optional<UserConnectedAccount> findByProviderAndProviderId(String provider, String providerId);
}