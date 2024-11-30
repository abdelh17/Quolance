'use client';
import { useMutation } from '@tanstack/react-query';
import httpClient from '@/lib/httpClient';
import { showToast } from '@/util/context/ToastProvider';
import { HttpErrorResponse } from '@/constants/models/http/HttpErrorResponse';

/*--- Hooks ---*/
export const useSubmitApplication = () => {
  return useMutation({
    mutationFn: (projectId: number) =>
      httpClient.post(`api/freelancer/submit-application`, { projectId }),
    onSuccess: () => {
      showToast('Application submitted successfully', 'success');
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

export const useCancelApplication = () => {
  return useMutation({
    mutationFn: (applicationId: number) =>
      httpClient.post(`api/freelancer/${applicationId}/cancel-application`),
    onSuccess: () => {
      showToast('Application cancelled successfully', 'success');
    },
    onError: (error) => {
      const ErrorResponse = error.response?.data as HttpErrorResponse;
      showToast(`Error: ${ErrorResponse.message}`, 'error');
    },
  });
};

/*--- Query functions ---*/
