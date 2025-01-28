package com.quolance.quolance_api.services.entity_services.impl;

import com.cloudinary.Cloudinary;
import com.quolance.quolance_api.dtos.FileDto;
import com.quolance.quolance_api.entities.FileEntity;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.repositories.FileRepository;
import com.quolance.quolance_api.services.entity_services.FileService;
import com.quolance.quolance_api.util.exceptions.ApiException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileServiceImpl implements FileService {

    private final Cloudinary cloudinary;
    private final FileRepository fileRepository;

    @Override
    public Map<String, Object> uploadFile(MultipartFile file, User uploadedBy) {
        log.debug("Attempting to upload file: {} by user ID: {}", file.getOriginalFilename(), uploadedBy.getId());

        Map<String, Object> uploadResult;
        String fileType = file.getContentType();
        String folder = (fileType != null && fileType.startsWith("image")) ? "images" : "files";

        try {
            uploadResult = cloudinary.uploader().upload(file.getBytes(), Map.of(
                    "resource_type", "auto",
                    "folder", folder
            ));

            // Save to database
            FileEntity fileEntity = new FileEntity();
            fileEntity.setUser(uploadedBy);
            fileEntity.setFileUrl((String) uploadResult.get("secure_url"));
            fileEntity.setFileType(file.getContentType());
            fileEntity.setFileName(file.getOriginalFilename());

            fileRepository.save(fileEntity);

            log.info("Successfully uploaded file: {} by user ID: {}", file.getOriginalFilename(), uploadedBy.getId());
            log.debug("File details: {}", fileEntity);

        } catch (IOException e) {
            log.error("Error uploading file: {} by user ID: {}", file.getOriginalFilename(), uploadedBy.getId(), e);
            throw new ApiException("Error uploading file");
        }

        return uploadResult;
    }

    @Override
    public Page<FileDto> getAllFileUploadsByUser(User user, Pageable pageable) {
        log.debug("Fetching all file uploads by user ID: {}", user.getId());

        Page<FileEntity> files = fileRepository.findFileUploadsByUser(user, pageable);
        Page<FileDto> fileDtos = files.map(FileDto::fromEntity);

        log.info("Successfully fetched {} file uploads by user ID: {}", fileDtos.getTotalElements(), user.getId());
        log.debug("File uploads details: {}", fileDtos);

        return fileDtos;
    }
}