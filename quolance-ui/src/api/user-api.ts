import { useMutation, useQueryClient } from '@tanstack/react-query';
import httpClient from '@/lib/httpClient';
import { showToast } from '@/util/context/ToastProvider';
import { HttpErrorResponse } from '@/models/http/HttpErrorResponse';

export const useDeleteAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            await httpClient.delete('/api/users/delete');
        },
        onSuccess: () => {
            // You might want to redirect or reset client state here
            queryClient.clear(); // Optional: clears all cached queries
            showToast('Account deleted successfully', 'success');
        },
        onError: (error) => {
            const errorResponse = error.response?.data as HttpErrorResponse;
            showToast(
                `Error deleting account: ${errorResponse?.message || 'Unknown error'}`,
                'error'
            );
        },
    });
};
