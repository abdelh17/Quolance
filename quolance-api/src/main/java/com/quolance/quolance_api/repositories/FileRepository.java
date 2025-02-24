package com.quolance.quolance_api.repositories;

import com.quolance.quolance_api.dtos.FileDto;
import com.quolance.quolance_api.entities.FileEntity;
import com.quolance.quolance_api.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface FileRepository extends JpaRepository<FileEntity, UUID> {
    void save(FileDto fileDto);

    Page<FileEntity> findFileUploadsByUser(User user, Pageable pageable);

    Optional<FileEntity> findByIdAndUserId(UUID fileId, UUID userId);
}