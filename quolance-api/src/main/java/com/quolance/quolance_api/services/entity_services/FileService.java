package com.quolance.quolance_api.services.entity_services;

import com.quolance.quolance_api.dtos.FileDto;
import com.quolance.quolance_api.entities.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface FileService {

    Map<String, Object> uploadFile(MultipartFile file, User uploadedBy);
    //List<FileUpload> (Long userId);
    List<FileDto> getAllFileUploadsByUser(User user);
}
