package com.quolance.quolance_api.dtos;

// import com.quolance.quolance_api.entities.Emojis;
// import com.quolance.quolance_api.entities.Reactions;
// import com.quolance.quolance_api.entities.User;
// import lombok.*;

// @Data
// @AllArgsConstructor
// @NoArgsConstructor
// @Builder
// public class emojiDto {

//     private long id;
//     private String emojiCode;
//     private long reactionId;
//     private long userId;

//     // Convert EmojiDto to Emojis entity
//     public Emojis toEntity(Reactions reaction, User user) {
//         return Emojis.builder()
//                 .id(this.id)
//                 .emojiCode(this.emojiCode)
//                 .reaction(reaction)
//                 .user(user)
//                 .build();
//     }

//     // Convert Emojis entity to EmojiDto
//     public static emojiDto fromEntity(Emojis emoji) {
//         return emojiDto.builder()
//                 .id(emoji.getId())
//                 .emojiCode(emoji.getEmojiCode())
//                 .reactionId(emoji.getReaction().getId())
//                 .userId(emoji.getUser().getId())
//                 .build();
//     }
// }