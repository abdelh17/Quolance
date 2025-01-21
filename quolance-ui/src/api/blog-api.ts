import { useQuery } from '@tanstack/react-query';
import httpClient from '@/lib/httpClient';
import { BlogPostViewType } from '@/constants/types/blog-types';
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
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    });
  };