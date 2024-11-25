'use client';
import { useMutation } from '@tanstack/react-query';
import httpClient from '@/lib/httpClient';
import { AxiosError } from 'axios';

/*--- Hooks ---*/
export const useSubmitApplication = (options?: {
  onSuccess?: () => void;
  onError?: (error: AxiosError) => void;
}) => {
  return useMutation({
    mutationFn: submitApplication,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};

/*--- Query functions ---*/
const submitApplication = async ({
  freelancerId,
  projectId,
}: {
  freelancerId: number;
  projectId: number;
}) => {
  return httpClient.post(`api/freelancer/submit-application`, {
    freelancerId,
    projectId,
  });
};
