package com.quolance.quolance_api.repositories;

import com.quolance.quolance_api.dtos.FileUploadDto;
import com.quolance.quolance_api.entities.FileUpload;
import com.quolance.quolance_api.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FileUploadRepository extends JpaRepository<FileUpload, Long> {
    void save(FileUploadDto fileUploadDto);
    List<FileUpload> findFileUploadsByUser(User user);
}
