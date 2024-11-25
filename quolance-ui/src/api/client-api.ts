import httpClient from '@/lib/httpClient';
import { useMutation, useQuery } from '@tanstack/react-query';

/*--- Hooks ---*/
export const useGetProjectSubmissions = (projectId: number) => {
  return useQuery({
    queryKey: ['project-submissions', projectId], // Add projectId to queryKey, important for caching
    queryFn: () =>
      httpClient.get(`api/client/projects/${projectId}/applications/all`),
  });
};

export const useApproveSubmission = () => {
  return useMutation({
    mutationFn: (applicationId: number) =>
      httpClient.post(
        `api/client/applications/${applicationId}/select-freelancer`
      ),
  });
};

export const useRejectSubmission = () => {
  return useMutation({
    mutationFn: (applicationId: number) =>
      httpClient.post(`api/client/${applicationId}/reject-freelancer`),
  });
};

/*--- Query functions ---*/
