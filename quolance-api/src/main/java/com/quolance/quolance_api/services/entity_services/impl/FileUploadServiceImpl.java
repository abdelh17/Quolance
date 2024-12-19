package com.quolance.quolance_api.services.entity_services.impl;

import com.cloudinary.Cloudinary;
import com.quolance.quolance_api.dtos.FileUploadDto;
import com.quolance.quolance_api.entities.FileUpload;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.repositories.FileUploadRepository;
import com.quolance.quolance_api.services.entity_services.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FileUploadServiceImpl implements FileUploadService {

    private final Cloudinary cloudinary;
    private final FileUploadRepository fileUploadRepository;

    @Override
    public Map<String, Object> uploadFile(MultipartFile file, User uploadedBy) {
        String contentType = file.getContentType();

        if (contentType == null) {
            throw new IllegalArgumentException("Invalid file. Content type is missing.");
        }
        // sort file type (can add others when needed)
        boolean isImage = contentType.startsWith("image/");
        String folder = isImage ? "image" : "cv";
        Map<String, Object> uploadResult ;

        // upload to Cloudinary
        try {
            uploadResult = cloudinary.uploader().upload(file.getBytes(), Map.of(
                    "resource_type", "auto",
                    "folder", folder
            ));

            FileUpload fileUpload = new FileUpload();
            fileUpload.setUser(uploadedBy);
            fileUpload.setFileUrl((String) uploadResult.get("url"));
            fileUpload.setFileName(file.getOriginalFilename());
            fileUpload.setFileType(contentType.toString());
            fileUploadRepository.save(fileUpload);

        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return  uploadResult;
    }

    @Override
    public List<FileUploadDto> getAllFileUploadsByUser(User user) {
        List<FileUpload> files = fileUploadRepository.findFileUploadsByUser(user);
        return files.stream().map(FileUploadDto::fromEntity).toList();
    }

}
