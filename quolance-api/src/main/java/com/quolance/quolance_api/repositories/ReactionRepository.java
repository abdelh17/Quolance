package com.quolance.quolance_api.repositories;

import com.quolance.quolance_api.entities.Reactions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReactionRepository extends JpaRepository<Reactions, Long> {
     
}