package com.quolance.quolance_api.dtos;

import lombok.*;

import java.time.LocalDate;

import com.quolance.quolance_api.entities.Reactions;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class reactionDto {

    private long id;
    private String type;
    private LocalDate createdAt;
    private String username; 


    // from entity method
    public static reactionDto fromEntity(Reactions reaction) {
        return reactionDto.builder()
                .id(reaction.getId())
                .type(reaction.getType())
                .createdAt(reaction.getCreatedAt())
                .username(reaction.getUser().getUsername())
                .build();
    }

    //to entity method
    public Reactions toEntity() {
        return Reactions.builder()
                .id(this.id)
                .type(this.type)
                .createdAt(this.createdAt)
                .build();
    }

}