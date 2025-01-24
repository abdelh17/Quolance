    package com.quolance.quolance_api.dtos.blog;

    import com.quolance.quolance_api.entities.blog.BlogComment;
    import com.quolance.quolance_api.entities.enums.BlogReactionType;
    import lombok.AllArgsConstructor;
    import lombok.Builder;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    import java.util.Map;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public class BlogCommentDto {

        private Long commentId;
        private Long blogPostId;
        private Long userId;
        private String content;
        // Map of reaction types and their counts
        private Map<BlogReactionType, Long> reactionCounts;

        public static BlogCommentDto fromEntity(BlogComment blogComment) {
            return BlogCommentDto.builder()
                    .commentId(blogComment.getId())
                    .blogPostId(blogComment.getBlogPost().getId())
                    .userId(blogComment.getUser().getId())
                    .content(blogComment.getContent())
                    .reactionCounts(blogComment.getReactionCounts())
                    .build();
        }

        public static BlogComment toEntity(BlogCommentDto blogPost) {
            return BlogComment.builder()
                    .content(blogPost.getContent())
                    .build();
        }
    }