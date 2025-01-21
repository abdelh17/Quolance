import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import httpClient from '@/lib/httpClient';
import { BlogPostType } from '@/constants/types/blog-types';
import { showToast } from '@/util/context/ToastProvider';
import { HttpErrorResponse } from '@/constants/models/http/HttpErrorResponse';

export const useCreateBlogPost = (options?: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
  }) => {
    return useMutation({
      mutationFn: (blogpost: BlogPostType) =>
        httpClient.post('/api/blog-posts/', blogpost),
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    });
  };