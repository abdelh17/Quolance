package com.quolance.quolance_api.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
public class FileUpload {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;
    @Getter @Setter
    private String fileName;
    @Getter @Setter
    private String fileUrl;
    @Getter @Setter
    private String fileType;

    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;


}
