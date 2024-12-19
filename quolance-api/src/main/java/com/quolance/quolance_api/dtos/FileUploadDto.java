package com.quolance.quolance_api.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.quolance.quolance_api.entities.FileUpload;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FileUploadDto {
    private long id;
    private String fileName;
    private String fileUrl;
    private Long userId;
    private String fileType;

    public static FileUploadDto fromEntity(FileUpload fileUpload) {
        return FileUploadDto.builder()
                .id(fileUpload.getId())
                .fileName(fileUpload.getFileName())
                .fileUrl(fileUpload.getFileUrl())
                .userId(fileUpload.getUser() != null ? fileUpload.getUser().getId() : null)
                .build();
    }



    
}
