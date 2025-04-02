package com.quolance.quolance_api.entities.profile;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.hibernate.validator.constraints.Length;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class WorkExperience {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String companyName;
    private String role;
    private LocalDate startDate;
    private LocalDate endDate;
    @Length(max = 5000)
    @Column(length = 5000)
    private String description;
    private String location;
}