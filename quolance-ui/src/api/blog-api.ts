
import { useQuery, useMutation } from '@tanstack/react-query';
import httpClient from '@/lib/httpClient';
import { BlogPostType, BlogPostViewType } from '@/constants/types/blog-types';
import { HttpErrorResponse } from '@/constants/models/http/HttpErrorResponse';


/* ---------- Blog Posts ---------- */
export const useGetAllBlogPosts = (options?: {
  onSuccess?: (data: BlogPostViewType[]) => void;
  onError?: (error: HttpErrorResponse) => void;
}) => {
  return useQuery<BlogPostViewType[], HttpErrorResponse>({
    queryKey: ['all-blog-posts'],
    queryFn: async () => {
      const response = await httpClient.get('/api/blog-posts/all');
      return response.data;
    },
    ...options,
  });
};

export const useCreateBlogPost = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  return useMutation({
      mutationFn: (blogpost: { title: string; content: string; userId?: number }) => {
          if (!blogpost.userId) {
              throw new Error("User ID is undefined. User must be logged in.");
          }
          return httpClient.post('/api/blog-posts', blogpost);
      },
      onSuccess: options?.onSuccess,
      onError: options?.onError,
  });
};

export interface BlogPostUpdateDto {
  postId: number;
  title: string;
  content: string;
}

// export const useUpdateBlogPost = (options?: {
//   onSuccess?: (data: BlogPostViewType) => void;
//   onError?: (error: HttpErrorResponse) => void;
// }) => {
//   return useMutation<BlogPostViewType, HttpErrorResponse, BlogPostUpdateDto>({
//     mutationFn: async (postData) => {
//       const response = await httpClient.put('/api/blog-posts/update', postData);
//       return response.data;
//     },
//     ...options,
//   });
// };

export const useDeleteBlogPost = (options?: {
  onSuccess?: () => void;
  onError?: (error: HttpErrorResponse) => void;
}) => {
  return useMutation<void, HttpErrorResponse, number>({
    mutationFn: async (postId) => {
      await httpClient.delete(`/api/blog-posts/${postId}`);
    },
    ...options,
  });
};



/* ---------- Blog Comments ---------- */
export interface CommentResponseDto {
  commentId: number;
  blogPostId: number;
  userId: number;
  content: string;
}

export const useGetCommentsByPostId = (postId: number, options?: {
  onSuccess?: (data: CommentResponseDto[]) => void;
  onError?: (error: HttpErrorResponse) => void;
}) => {
  return useQuery<CommentResponseDto[], HttpErrorResponse>({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const response = await httpClient.get(`/api/blog-comments/post/${postId}`);
      return response.data;
    },
    enabled: !!postId, // Only fetch if postId is defined
    ...options,
  });
};

export interface CommentRequestDto {
  content: string;
}

export const useAddComment = (postId: number, options?: {
  onSuccess?: (data: CommentResponseDto) => void;
  onError?: (error: HttpErrorResponse) => void;
}) => {
  return useMutation<CommentResponseDto, HttpErrorResponse, CommentRequestDto>({
    mutationFn: async (newComment) => {
      const response = await httpClient.post(`/api/blog-comments/${postId}`, newComment);
      return response.data;
    },
    ...options,
  });
};


/* ---------- Blog Reactions ---------- */
export interface ReactionResponseDto {
  id: number;
  reactionType: string;
  userId: number;
  userName: string;
  blogPostId: number;
}

export const useGetReactionsByPostId = (postId: number, options?: {
  onSuccess?: (data: ReactionResponseDto[]) => void;
  onError?: (error: HttpErrorResponse) => void;
}) => {
  return useQuery<ReactionResponseDto[], HttpErrorResponse>({
    queryKey: ['post-reactions', postId],
    queryFn: async () => {
      const response = await httpClient.get(`/api/blog-posts/reactions/post/${postId}`);
      return response.data;
    },
    enabled: !!postId, // Only fetch if postId is defined
    ...options,
  });
};

export interface ReactionRequestDto {
  reactionType: string;
  blogPostId: number;
}

export const useReactToPost = (options?: {
  onSuccess?: (data: ReactionResponseDto) => void;
  onError?: (error: HttpErrorResponse) => void;
}) => {
  return useMutation<ReactionResponseDto, HttpErrorResponse, ReactionRequestDto>({
    mutationFn: async (reactionRequest) => {
      const response = await httpClient.post('/api/blog-posts/reactions/post', reactionRequest);
      return response.data;
    },
    ...options,
  });
};

export const useRemoveReaction = (options?: {
  onSuccess?: () => void;
  onError?: (error: HttpErrorResponse) => void;
}) => {
  return useMutation<void, HttpErrorResponse, number>({
    mutationFn: async (reactionId) => {
      await httpClient.delete(`/api/blog-posts/reactions/${reactionId}`);
    },
    ...options,
  });
};
