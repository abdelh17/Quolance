import httpClient from '@/lib/httpClient';
import { useMutation, useQuery } from '@tanstack/react-query';

/*--- Hooks ---*/
export const useGetProjectSubmissions = (projectId: number) => {
  return useQuery({
    queryKey: ['project-submissions', projectId], // Add projectId to queryKey, important for caching
    queryFn: () => getProjectSubmissions(projectId),
  });
};

export const useApproveSubmission = () => {
  return useMutation({
    mutationFn: approveSubmission,
  });
};

/*--- Query functions ---*/
const getProjectSubmissions = async (projectId: number) => {
  return httpClient.get(`api/client/projects/${projectId}/applications`);
};

const approveSubmission = async (applicationId: number) => {
  return httpClient.post(`api/client/${applicationId}/select-freelancer`);
};
