package com.quolance.quolance_api.services.entity_services;

import com.quolance.quolance_api.dtos.FileDto;
import com.quolance.quolance_api.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.UUID;

public interface FileService {

    Map<String, Object> uploadFile(MultipartFile file, User uploadedBy);

    void deleteFile(UUID fileId, User user);

    Page<FileDto> getAllFileUploadsByUser(User user, Pageable pageable);
}