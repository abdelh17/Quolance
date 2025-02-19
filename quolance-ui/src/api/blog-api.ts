import {useMutation, useQuery} from '@tanstack/react-query';
import httpClient from '@/lib/httpClient';
import {BlogPostViewType} from '@/constants/types/blog-types';
import {HttpErrorResponse} from '@/constants/models/http/HttpErrorResponse';
import { PagedResponse } from '@/constants/models/http/PagedResponse';
import { PaginationParams } from '@/constants/types/pagination-types';
import { queryToString } from '@/util/stringUtils';


/* ---------- Blog Posts ---------- */
export interface BlogPostUpdateDto {
  postId: string;
  title: string;
  content: string;
}

export const useCreateBlogPost = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  return useMutation({
    mutationFn: (blogpost: { title: string; content: string; userId?: string; files?: File[] }) => {
      if (!blogpost.userId) {
        throw new Error("User ID is undefined. User must be logged in.");
      }

      // Construct FormData
      const formData = new FormData();
      formData.append("title", blogpost.title);
      formData.append("content", blogpost.content);
      formData.append("userId", String(blogpost.userId));

      // Correctly append multiple files under the key "files"
      if (blogpost.files && blogpost.files.length > 0) {
        blogpost.files.forEach((file) => {
          formData.append("images", file);
        });
      }

      return httpClient.post('/api/blog-posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};


export const useGetAllBlogPosts = (query: PaginationParams) => {
  return useQuery({
    queryKey: ["all-blog-posts", query],
    queryFn: async () => {
      const response = await httpClient.get(`/api/blog-posts?${queryToString(query)}`);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};


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
  return useMutation<void, HttpErrorResponse, string>({
    mutationFn: async (postId) => {
      await httpClient.delete(`/api/blog-posts/${postId}`);
    },
    ...options,
  });
};

/* ---------- Blog Comments ---------- */
export interface CommentResponseDto {
  commentId: string;
  blogPostId: string;
  userId: string;
  content: string;
}

export interface CommentRequestDto {
  content: string;
}

export const useGetCommentsByPostId = (postId: string, options?: {
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

export const useAddComment = (postId: string, options?: {
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

export const useDeleteComment = (options?: {
  onSuccess?: () => void;
  onError?: (error: HttpErrorResponse) => void;
}) => {
  return useMutation<void, HttpErrorResponse, string>({
    mutationFn: async (commentId) => {
      await httpClient.delete(`/api/blog-comments/${commentId}`);
    },
    ...options,
  });
};


/* ---------- Blog Reactions ---------- */
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

export const useGetReactionsByPostId = (postId: string, options?: {
  onSuccess?: (data: ReactionResponseDto[]) => void;
  onError?: (error: HttpErrorResponse) => void;
}) => {
  return useQuery<ReactionResponseDto[], HttpErrorResponse>({
    queryKey: ['post-reactions', postId],
    queryFn: async () => {
      const response = await httpClient.get(`/api/blog-posts/reactions/post/${postId}`);
      return response.data;
    },
    enabled: !!postId,
    ...options,
  });
};

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
  return useMutation<void, HttpErrorResponse, string>({
    mutationFn: async (reactionId) => {
      await httpClient.delete(`/api/blog-posts/reactions/${reactionId}`);
    },
    ...options,
  });
};
