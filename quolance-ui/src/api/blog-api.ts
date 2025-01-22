import { useMutation } from '@tanstack/react-query';
import httpClient from '@/lib/httpClient';
import { BlogPostType } from '@/constants/types/blog-types';

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