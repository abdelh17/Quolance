package com.quolance.quolance_api.entities.profile;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

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
    private String description;
}