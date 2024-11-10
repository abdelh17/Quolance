import { useMutation, useQuery } from '@tanstack/react-query';
import httpClient from '@/lib/httpClient';
import { PostProjectType } from '@/constants/types/project-types';

//
// /projects/ => query key: ['projects']
// /projects/:id => query key: ['project', projectId]
// /projects?status=APPROVED => query key: ['projects, {status: 'APPROVED'}]

/*--- Hooks ---*/
export const useGetProjectInfo = (projectId: number) => {
  return useQuery({
    queryKey: ['projects', projectId],
    queryFn: () => getProjectInfo(projectId),
    enabled: !!projectId,
  });
};

export const useGetAllProjects = () => {
  return useQuery({
    queryKey: ['projects'],
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
    onError: options?.onError,
  });
};

// /*--- Query functions ---*/
const getProjectInfo = async (projectId: number) => {
  return httpClient.get(`/api/public/projects/${projectId}`);
};

const getAllProjects = async () => {
  return httpClient.get('/api/public/projects/all');
};

const postProject = async (project: PostProjectType) => {
  return httpClient.post('/api/client/create-project', project);
};
