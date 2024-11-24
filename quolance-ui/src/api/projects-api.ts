import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import httpClient from '@/lib/httpClient';
import { PostProjectType, ProjectType } from '@/constants/types/project-types';

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

export const useUpdateProject = (project: ProjectType) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', project.id] });
    },
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

const updateProject = async (project: ProjectType) => {
  return httpClient.put(`/api/client/projects/${project.id}`, project);
};
