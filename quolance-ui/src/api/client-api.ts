import httpClient from '@/lib/httpClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/util/context/ToastProvider';
import { HttpErrorResponse } from '@/constants/models/http/HttpErrorResponse';

/*--- Hooks ---*/
export const useGetProjectSubmissions = (projectId: number) => {
  return useQuery({
    queryKey: ['project-submissions', projectId], // Add projectId to queryKey, important for caching
    queryFn: () =>
      httpClient.get(`api/client/projects/${projectId}/applications/all`),
  });
};

export const useApproveSubmission = (projectId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: number) =>
      httpClient.post(
        `api/client/applications/${applicationId}/select-freelancer`
      ),
    onSuccess: () => {
      // Invalidate the cache to force a re-fetch
      queryClient.invalidateQueries({
        queryKey: ['project-submissions', projectId],
      });
      showToast('Freelancer selected successfully', 'success');
    },
    onError: (error) => {
      const ErrorResponse = error.response?.data as HttpErrorResponse;
      showToast(`Error: ${ErrorResponse.message}`, 'error');
    },
  });
};

export const useRejectSubmissions = (projectId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (applicationIds: number[]) =>
      httpClient.post(
        `api/client/applications/bulk/reject-freelancer`,
        applicationIds
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['project-submissions', projectId],
      });
      showToast('Freelancers rejected successfully', 'success');
    },
  });
};

interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
}

export const useGetAllClientProjects = (params: PaginationParams) => {
  const queryString = new URLSearchParams({
    page: params.page?.toString() || '0',
    size: params.size?.toString() || '10',
    sortBy: params.sortBy || 'id',
    sortDirection: params.sortDirection || 'asc',
  }).toString();

  return useQuery({
    queryKey: ['clientProjects', params],
    queryFn: async () => {
      const response = await httpClient.get(`/api/client/projects/all?${queryString}`);
      return response.data; // Return the data from the Axios response
    },
  });
};