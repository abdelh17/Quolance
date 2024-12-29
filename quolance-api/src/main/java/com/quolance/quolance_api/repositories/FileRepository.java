package com.quolance.quolance_api.repositories;

import com.quolance.quolance_api.dtos.FileDto;
import com.quolance.quolance_api.entities.FileEntity;
import com.quolance.quolance_api.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FileRepository extends JpaRepository<FileEntity, Long> {
    void save(FileDto fileDto);
    List<FileEntity> findFileUploadsByUser(User user);
}
