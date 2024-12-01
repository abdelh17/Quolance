import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import httpClient from '@/lib/httpClient';
import { PostProjectType, ProjectType } from '@/constants/types/project-types';
import { AxiosError } from 'axios';

/*--- Hooks ---*/
export const useGetProjectInfo = (projectId: number) => {
  return useQuery({
    queryKey: ['projects', projectId],
    queryFn: () => httpClient.get(`/api/public/projects/${projectId}`),
    enabled: !!projectId,
  });
};

export const useGetAllPublicProjects = () => {
  return useQuery({
    queryKey: ['all-public-projects'],
    queryFn: () => getAllPublicProjects(),
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

export const useUpdateProject = (
  projectId: number,
  options?: {
    onSuccess?: () => void;
    onError?: (error: AxiosError) => void;
  }
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (project: ProjectType) =>
      httpClient.put(`/api/client/projects/${project.id}`, project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] });
      options?.onSuccess && options.onSuccess();
    },
    onError: options?.onError,
  });
};

// /*--- Query functions ---*/
const getAllPublicProjects = async () => {
  return httpClient.get('/api/public/projects/all');
};

const postProject = async (project: PostProjectType) => {
  return httpClient.post('/api/client/create-project', project);
};
