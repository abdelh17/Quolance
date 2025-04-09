export type BlogPostViewType = {
    id: string;
    title: string;
    content: string;
    authorName: string;
    dateCreated: string;
    comments: CommentType[];
}

export type BlogPostType = {
    title: string;
    content: string;
    userId: string;
};

export type CommentType = {
    authorName: string;
    profilePicture?: string;
    content: string;
    dateCreated: string;
}

export interface CommentResponseDto {
    commentId: string;
    blogPostId: string;
    username: string;
    content: string;
  }
  
export interface CommentRequestDto {
content: string;
}

export interface BlogPostUpdateDto {
    postId: string;
    title: string;
    content: string;
    // tags: string[];
    // files?: File[];
  }

  export interface ReactionResponseDto {
    id: string;
    reactionType: string;
    userId: string;
    userName: string;
    blogPostId: string;
  }
  
  export interface ReactionRequestDto {
    reactionType: string;
    blogPostId: string;
  }