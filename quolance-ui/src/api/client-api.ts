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

export const useGetAllClientProjects = () => {
  return useQuery({
    queryKey: ['all-client-projects'],
    queryFn: (projectId) => httpClient.get(`api/client/projects/${projectId}/applications/all`),
  });
};

/*--- Query functions ---*/