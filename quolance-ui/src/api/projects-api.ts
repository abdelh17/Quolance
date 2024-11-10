import { useMutation, useQuery } from '@tanstack/react-query';
import httpClient from '@/lib/httpClient';
import { PostProjectType } from '@/constants/types/projectTypes';
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
};

export const usePostProject = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  return useMutation({
    mutationFn: postProject,
    onSuccess: options?.onSuccess,
    onError: options?.onError
  });
};

// /*--- Query functions ---*/
// const getProjectInfo = async (projectId: number) => {
//   return DATA_ProjectList.find((project) => project.id === projectId);
// };

const getAllProjects = async () => {
  return httpClient.get('/api/public/projects/all');
};

const postProject = async (project: PostProjectType) => {
  return httpClient.post('/api/client/create-project', project);
};
