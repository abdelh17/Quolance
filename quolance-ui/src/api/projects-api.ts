import { useQuery } from '@tanstack/react-query';
import httpClient from '@/lib/httpClient';

/*--- Hooks ---*/
// export const useGetProjectInfo = (projectId: number) => {
//   return useQuery({
//     queryKey: ['project-info', projectId], // Add projectId to queryKey, important for caching
//     queryFn: () => getProjectInfo(projectId),
//     enabled: !!projectId,
//   });
// };

export const useGetAllProjects = () => {
  return useQuery({
    queryKey: ['all-projects'],
    queryFn: () => getAllProjects(),
  });
}

// /*--- Query functions ---*/
// const getProjectInfo = async (projectId: number) => {
//   return DATA_ProjectList.find((project) => project.id === projectId);
// };

const getAllProjects = async () => {
  return httpClient.get('/api/public/projects/all');
}
