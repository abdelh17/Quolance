package com.quolance.quolance_api.dtos;

import com.quolance.quolance_api.entities.FileEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FileDto {
    private UUID id;
    private String fileName;
    private String fileUrl;
    private UUID userId;
    private String fileType;

    public static FileDto fromEntity(FileEntity fileEntity) {
        return FileDto.builder()
                .id(fileEntity.getId())
                .fileName(fileEntity.getFileName())
                .fileUrl(fileEntity.getFileUrl())
                .userId(fileEntity.getUser() != null ? fileEntity.getUser().getId() : null)
                .fileType(fileEntity.getFileType())
                .build();
    }


}
