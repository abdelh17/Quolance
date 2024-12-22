package com.quolance.quolance_api.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class FileEntity extends AbstractEntity{


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    private String fileName;

    private String fileUrl;
    
    private String fileType;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;


}
