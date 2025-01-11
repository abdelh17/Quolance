import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import httpClient from '@/lib/httpClient';
import { showToast } from '@/util/context/ToastProvider';
import { HttpErrorResponse } from '@/constants/models/http/HttpErrorResponse';
import { ApplicationResponse } from '@/constants/models/applications/ApplicationResponse';

/*--- Hooks ---*/
export const useSubmitApplication = (projectId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      httpClient.post(`api/freelancer/submit-application`, { projectId }),
    onSuccess: () => {
      showToast('Application submitted successfully', 'success');
      queryClient.invalidateQueries({ queryKey: ['applications', projectId] });
    },
    onError: (error) => {
      const ErrorResponse = error.response?.data as HttpErrorResponse;
      showToast(
        `Error submitting application: ${ErrorResponse.message}`,
        'error'
      );
    },
  });
};

export const useCancelApplication = (projectId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: number) =>
      httpClient.delete(`api/freelancer/applications/${applicationId}`),
    onSuccess: () => {
      showToast('Application cancelled successfully', 'success');
      queryClient.invalidateQueries({ queryKey: ['applications', projectId] });
    },
    onError: (error) => {
      const ErrorResponse = error.response?.data as HttpErrorResponse;
      showToast(`Error: ${ErrorResponse.message}`, 'error');
    },
  });
};

interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
}

export const useGetAllFreelancerApplications = (params: PaginationParams) => {
  const queryString = new URLSearchParams({
    page: params.page?.toString() || '0',
    size: params.size?.toString() || '10',
    sortBy: params.sortBy || 'id',
    sortDirection: params.sortDirection || 'asc',
  }).toString();

  return useQuery({
    queryKey: ['freelancerApplications', params],
    queryFn: async () => {
      const response = await httpClient.get(`/api/freelancer/applications/all?${queryString}`);
      return response.data;
    },
  });
};

export const useGetProjectApplication = (projectId: number) => {
  return useQuery({
    queryKey: ['applications', projectId],
    queryFn: async (): Promise<ApplicationResponse | null> => {
      const { data } = await httpClient.get<ApplicationResponse[]>(
        'api/freelancer/applications/all'
      );
      return (
        data.find((application) => application.projectId === projectId) || null
      );
    },
  });
};

/*--- Query functions ---*/
