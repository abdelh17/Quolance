package com.quolance.quolance_api.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class FileEntity extends AbstractEntity {

    private String fileName;

    private String fileUrl;

    private String fileType;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;


}
