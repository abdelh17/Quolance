
import { useQuery, useMutation } from '@tanstack/react-query';
import httpClient from '@/lib/httpClient';
import { BlogPostType, BlogPostViewType } from '@/constants/types/blog-types';
import { HttpErrorResponse } from '@/constants/models/http/HttpErrorResponse';

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

