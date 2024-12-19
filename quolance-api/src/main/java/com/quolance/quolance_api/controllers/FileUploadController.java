package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.FileUploadDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.entity_services.FileUploadService;
import com.quolance.quolance_api.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/files")
public class FileUploadController {

    private final FileUploadService fileUploadService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadFile(
            @RequestParam("file") MultipartFile file){
        try {
            User uploadedBy = SecurityUtil.getAuthenticatedUser();
            Map<String, Object> uploadResult = fileUploadService.uploadFile(file,uploadedBy);
            return ResponseEntity.ok(uploadResult);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<FileUploadDto>> getAllUserFiles(){
        User user = SecurityUtil.getAuthenticatedUser();
        List<FileUploadDto> files = fileUploadService.getAllFileUploadsByUser(user);
        return ResponseEntity.ok(files);
    }
}
