package com.quolance.quolance_api.dtos.blog;

import com.quolance.quolance_api.entities.enums.BlogReactionType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReactionRequestDto {
    @NotNull(message = "Reaction type cannot be null")
    private BlogReactionType reactionType;
}
