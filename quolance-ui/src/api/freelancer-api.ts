'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import httpClient from '@/lib/httpClient';
import { showToast } from '@/util/context/ToastProvider';
import { HttpErrorResponse } from '@/constants/models/http/HttpErrorResponse';
import { ApplicationResponse } from '@/constants/models/applications/ApplicationResponse';

/*--- Hooks ---*/
export const useSubmitApplication = (projectId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (projectId: number) =>
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

export const useGetProjectApplication = (projectId: number) => {
  return useQuery({
    queryKey: ['applications', projectId],
    queryFn: async (): Promise<ApplicationResponse | undefined> => {
      const { data } = await httpClient.get<ApplicationResponse[]>(
        'api/freelancer/applications/all'
      );
      return data.find((application) => application.projectId === projectId);
    },
  });
};

/*--- Query functions ---*/
