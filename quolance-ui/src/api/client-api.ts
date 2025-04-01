import httpClient from '@/lib/httpClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/util/context/ToastProvider';
import { HttpErrorResponse } from '@/models/http/HttpErrorResponse';
import {
  PaginationParams,
  PaginationQueryDefault,
} from '@/constants/types/pagination-types';
import { queryToString } from '@/util/stringUtils';
import { ProjectType } from '@/constants/types/project-types';
import { PostReviewType } from '@/models/user/UserResponse';

/*--- Filters ---*/
export interface CandidateFilterQuery extends PaginationParams {
  searchName?: string;
  experienceLevel?: string;
  availability?: string;
  skills?: string[];
}

export const CandidateFilterQueryDefault = {
  ...PaginationQueryDefault,
  searchName: '',
  experienceLevel: '',
  availability: '',
  skills: [],
};

/*--- Hooks ---*/
export const useGetProjectSubmissions = (projectId: string) => {
  return useQuery({
    queryKey: ['project-submissions', projectId], // Add projectId to queryKey, important for caching
    queryFn: () =>
      httpClient.get(`api/client/projects/${projectId}/applications/all`),
  });
};

export const useApproveSubmission = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: string) =>
      httpClient.post(
        `api/client/applications/${applicationId}/select-freelancer`
      ),
    onSuccess: () => {
      // Invalidate the cache to force a re-fetch
      queryClient.invalidateQueries({
        queryKey: ['project-submissions', projectId],
      });
      showToast('Freelancer selected successfully', 'success');
    },
    onError: (error) => {
      const ErrorResponse = error.response?.data as HttpErrorResponse;
      showToast(`Error: ${ErrorResponse.message}`, 'error');
    },
  });
};

export const useRejectSubmissions = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (applicationIds: string[]) =>
      httpClient.post(
        `api/client/applications/bulk/reject-freelancer`,
        applicationIds
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['project-submissions', projectId],
      });
      showToast('Freelancers rejected successfully', 'success');
    },
  });
};

export const useGetAllClientProjects = (
  params: PaginationParams,
  enabled = true,
  completed = false
) => {
  const queryString = new URLSearchParams({
    page: params.page?.toString() || '0',
    size: params.size?.toString() || '10',
    sortBy: params.sortBy || 'id',
    sortDirection: params.sortDirection || 'asc',
  }).toString();

  return useQuery({
    queryKey: ['clientProjects', params, completed],
    enabled,
    queryFn: async () => {
      const response = await httpClient.get(
        `/api/client/projects/all?${queryString}`
      );

      return {
        data: completed
          ? {
              ...response.data,
              content: response.data.content.filter(
                (project: ProjectType) => project.projectStatus === 'CLOSED'
              ),
            }
          : response.data,
      };
    },
  });
};

/** Gets all the candidates in the website. Called for the repository of candidates. TO-DO should be renamed */
export const useGetAllCandidates = (query: CandidateFilterQuery) => {
  return useQuery({
    queryKey: ['all-candidates', query],
    queryFn: () =>
      httpClient.get(`/api/client/freelancers/all?${queryToString(query)}`),
  });
};

/** 
 * Gets top N freelancer recommendations for a project.
 * Endpoint: GET /api/recommendations/{projectId}?topN={topN}
 */
export const useGetFreelancerRecommendations = (projectId: string, topN: number) => {
  return useQuery({
    queryKey: ['freelancer-recommendations', projectId, topN],
    queryFn: () =>
      httpClient.get(`/api/recommendations/${projectId}?topN=${topN}`),
  });
};

export const usePostReview = () => {
  return useMutation({
    mutationFn: (review: PostReviewType) =>
      httpClient.post('/api/client/project/review', review),
    onSuccess: () => {
      showToast('Review submitted successfully', 'success');
    },
    onError: (error) => {
      const ErrorResponse = error.response?.data as HttpErrorResponse;
      showToast(`Error: ${ErrorResponse.message}`, 'error');
    },
  });
};
