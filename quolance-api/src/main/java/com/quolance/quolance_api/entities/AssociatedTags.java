package com.quolance.quolance_api.entities;


import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "associated_tags")
public class AssociatedTags extends AbstractEntity{

        private String submitionDetails;
        private String status;
}
