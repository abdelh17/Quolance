import { useMutation, useQuery } from '@tanstack/react-query';

import httpClient from '@/lib/httpClient';

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

export const useGetAllClientProjects = () => {
  return useQuery({
    queryKey: ['all-client-projects'],
    queryFn: () => getAllClientProjects(),
  });
};

/*--- Query functions ---*/
const getProjectSubmissions = async (projectId: number) => {
  return httpClient.get(`api/client/projects/${projectId}/applications/all`);
};

const getAllClientProjects = async () => {
  return httpClient.get('/api/client/projects/all');
};

const approveSubmission = async (applicationId: number) => {
  return httpClient.post(`api/client/${applicationId}/select-freelancer`);
};
