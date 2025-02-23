import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import httpClient from '@/lib/httpClient';
import { PostProjectType, ProjectType } from '@/constants/types/project-types';
import { AxiosError } from 'axios';
import {
  PaginationParams,
  PaginationQueryDefault,
} from '@/constants/types/pagination-types';
import { queryToString } from '@/util/stringUtils';

/** Project Filter **/
export interface ProjectFilterQuery extends PaginationParams {
  searchTitle?: string;
  category?: string;
  priceRange?: string;
  experienceLevel?: string;
  // More filters can be added here
}

export const ProjectFilterQueryDefault = {
  ...PaginationQueryDefault,
  title: '',
  category: '',
  priceRange: '',
  experienceLevel: '',
  // More filters can be added here
};

/*--- Hooks ---*/
export const useGetProjectInfo = (
  projectId: string,
  role: 'client' | 'freelancer' | 'public',
  isUserLoading: boolean
) => {
  return useQuery({
    queryKey: ['projects', projectId],
    queryFn: () => httpClient.get(`/api/${role}/projects/${projectId}`),
    enabled: !!projectId && !!role && !isUserLoading,
  });
};

export const useGetAllPublicProjects = (
  query: ProjectFilterQuery,
  enabled = true
) => {
  return useQuery({
    queryKey: ['all-public-projects', query],
    enabled,
    queryFn: () =>
      httpClient.get(`/api/public/projects/all?${queryToString(query)}`),
  });
};

export const usePostProject = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  return useMutation({
    mutationFn: (project: PostProjectType) =>
      httpClient.post('/api/client/create-project', project),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};

export const useUpdateProject = (
  projectId: string,
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

/*--- Query functions ---*/
