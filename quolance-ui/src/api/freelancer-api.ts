import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import httpClient from '@/lib/httpClient';
import { showToast } from '@/util/context/ToastProvider';
import { HttpErrorResponse } from '@/constants/models/http/HttpErrorResponse';
import { FreelancerProfileType } from '@/constants/models/user/UserResponse';
import { ProjectFilterQuery } from '@/api/projects-api';
import { queryToString } from '@/util/stringUtils';
import { ApplicationResponse } from '@/constants/models/applications/ApplicationResponse';

/*--- Hooks ---*/
export const useSubmitApplication = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (message: string) =>
      httpClient.post(`api/freelancer/submit-application`, {
        message,
        projectId,
      }),
    onSuccess: () => {
      showToast('Application submitted successfully', 'success');
      queryClient.invalidateQueries({ queryKey: ['applications', projectId] });
    },
    onError: (error) => {
      const ErrorResponse = error.response?.data as HttpErrorResponse;
      showToast(
        `Error submitting application: ${ErrorResponse.message}`,
        'error'
      );
    },
  });
};

export const useCancelApplication = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: string) =>
      httpClient.delete(`api/freelancer/applications/${applicationId}`),
    onSuccess: () => {
      showToast('Application cancelled successfully', 'success');
      queryClient.invalidateQueries({ queryKey: ['applications', projectId] });
    },
    onError: (error) => {
      const ErrorResponse = error.response?.data as HttpErrorResponse;
      showToast(`Error: ${ErrorResponse.message}`, 'error');
    },
  });
};

interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
}

export const useGetAllFreelancerApplications = (
  params: PaginationParams,
  enabled = true
) => {
  const queryString = new URLSearchParams({
    page: params.page?.toString() || '0',
    size: params.size?.toString() || '10',
    sortBy: params.sortBy || 'id',
    sortDirection: params.sortDirection || 'asc',
  }).toString();

  return useQuery({
    queryKey: ['freelancerApplications', params],
    enabled,
    queryFn: async () => {
      const response = await httpClient.get(
        `/api/freelancer/applications/all?${queryString}`
      );
      return response.data;
    },
  });
};

export const useGetProjectApplication = (projectId: string) => {
  return useQuery<ApplicationResponse>({
    queryKey: ['applications', projectId],
    queryFn: async () => {
      const { data } = await httpClient.get('api/freelancer/applications/all');
      return (
        data.content.find(
          (application: ApplicationResponse) =>
            application.projectId === projectId
        ) || null
      );
    },
  });
};

export const useGetFreelancerProjects = (
  query: ProjectFilterQuery,
  enabled = true,
  showOnlyApplied = false
) => {
  return useQuery({
    queryKey: ['freelancerAppliedProjects', query, showOnlyApplied],
    enabled,
    queryFn: () =>
      httpClient.get(
        `/api/freelancer/projects/all?${queryToString({
          ...query,
          ...(showOnlyApplied && { applied: true }),
        })}`
      ),
  });
};

export const useGetFreelancerProfile = (username?: string) => {
  return useQuery({
    queryKey: ['freelancerProfile', username],
    queryFn: async () => {
      if (!username) {
        throw new Error('Username is required');
      }
      const response = await httpClient.get(
        `api/public/freelancer/profile/${username}`
      );
      return response.data;
    },
    enabled: !!username,
  });
};

export const useEditProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profile: FreelancerProfileType) =>
      httpClient.put(`api/freelancer/profile`, profile),
    onSuccess: () => {
      showToast('Profile updated successfully', 'success');
      queryClient.invalidateQueries({ queryKey: ['freelancerProfile'] });
    },
    onError: (error) => {
      const errorResponse = error.response?.data as { message: string };
      showToast(
        `Error updating profile: ${errorResponse?.message || 'Unknown error'}`,
        'error'
      );
    },
  });
};

export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('photo', file);

      return httpClient.post('api/freelancer/profile/picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freelancerProfile'] });
    },
    onError: (error) => {
      const errorResponse = error.response?.data as { message: string };
      showToast(
        `Error uploading profile image: ${
          errorResponse?.message || 'Unknown error'
        }`,
        'error'
      );
    },
  });
};

export const useGetProfileCompletion = () => {
  return useQuery<number>({
    queryKey: ['profileCompletion'],
    queryFn: async () => {
      const response = await httpClient.get(
        '/api/freelancer/profile/completion'
      );
      return response.data;
    },
  });
};

/*--- Query functions ---*/
