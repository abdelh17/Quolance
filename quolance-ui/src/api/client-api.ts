import httpClient from '@/lib/httpClient';
import { useQuery } from '@tanstack/react-query';

/*--- Hooks ---*/
export const useGetProjectSubmissions = (projectId: number) => {
  return useQuery({
    queryKey: ['project-submissions', projectId], // Add projectId to queryKey, important for caching
    queryFn: () => getProjectSubmissions(projectId),
    enabled: !!projectId,
  });
};

/*--- Query functions ---*/
const getProjectSubmissions = async (projectId: number) => {
  return httpClient.get(`api/client/projects/${projectId}/applications`);
};
