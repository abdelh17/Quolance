import { useMutation, UseMutationResult } from '@tanstack/react-query';
import httpClient from '@/lib/httpClient';
import { showToast } from '@/util/context/ToastProvider';
import { HttpErrorResponse } from '@/models/http/HttpErrorResponse';

/** Custom type that merges React Query's mutation result with `isLoading`. */
type MutationWithIsLoading<TData, TError, TVariables> = UseMutationResult<
  TData,
  TError,
  TVariables
> & {
  isLoading: boolean;
};

interface GenerateApplicationVars {
  projectId: string;
  prompt: string;
}

export function useGenerateApplicationLetter() {
  const mutation = useMutation<
    string,
    HttpErrorResponse,
    GenerateApplicationVars
  >({
    mutationFn: async ({ projectId, prompt }) => {
      const response = await httpClient.post(
        '/api/text-generation/application',
        { projectId, prompt },
        { responseType: 'text' }
      );
      return response.data;
    },
    onSuccess: () => {
      showToast('AI generation (Application) succeeded', 'success');
    },
    onError: (error) => {
      const errorMessage = error?.message ?? 'Unknown error';
      showToast(`Error generating application text: ${errorMessage}`, 'error');
    },
  });

  return {
    ...mutation,
    isLoading: mutation.status === 'pending',
  };
}
/**
 * Hook to generate "About" text using the AI text-generation endpoint.
 * Expects the endpoint to return plain text as the response body.
 */
export const useGenerateAbout = (): MutationWithIsLoading<
  string,
  HttpErrorResponse,
  string
> => {
  const mutation = useMutation<string, HttpErrorResponse, string>({
    mutationFn: async (prompt: string) => {
      // We specify responseType: 'text' so Axios doesn't parse it as JSON
      const response = await httpClient.post(
        '/api/text-generation/about',
        { prompt },
        { responseType: 'text' }
      );
      return response.data; // This should be the generated text
    },
    onSuccess: () => {
      showToast('AI generation (About) succeeded', 'success');
    },
    onError: (error) => {
      const errorMessage = error?.message ?? 'Unknown error';
      showToast(`Error generating About text: ${errorMessage}`, 'error');
    },
  });

  // Return the mutation plus a derived `isLoading` property
  return {
    ...mutation,
    isLoading: mutation.status === 'pending',
  };
};

/**
 * Hook to generate "Project" text using the AI text-generation endpoint.
 */
export const useGenerateProject = (): MutationWithIsLoading<
  string,
  HttpErrorResponse,
  string
> => {
  const mutation = useMutation<string, HttpErrorResponse, string>({
    mutationFn: async (prompt: string) => {
      const response = await httpClient.post(
        '/api/text-generation/project',
        { prompt },
        { responseType: 'text' }
      );
      return response.data;
    },
    onSuccess: () => {
      showToast('AI generation (Project) succeeded', 'success');
    },
    onError: (error) => {
      const errorMessage = error?.message ?? 'Unknown error';
      showToast(`Error generating Project text: ${errorMessage}`, 'error');
    },
  });

  return {
    ...mutation,
    isLoading: mutation.status === 'pending',
  };
};

/**
 * A more generic hook that takes an endpoint type as an argument.
 * This can be useful if you want to avoid creating multiple hooks for each context.
 */
export const useGenerateText = (
  endpoint: string
): MutationWithIsLoading<string, HttpErrorResponse, string> => {
  const mutation = useMutation<string, HttpErrorResponse, string>({
    mutationFn: async (prompt: string) => {
      const response = await httpClient.post(
        `/api/text-generation/${endpoint}`,
        { prompt },
        { responseType: 'text' }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      showToast(
        `AI generation (${endpoint}) succeeded for prompt: ${variables}`,
        'success'
      );
    },
    onError: (error) => {
      const errorMessage = error?.message ?? 'Unknown error';
      showToast(
        `Error generating text for ${endpoint}: ${errorMessage}`,
        'error'
      );
    },
  });

  return {
    ...mutation,
    isLoading: mutation.status === 'pending',
  };
};

/**
 * Hook to generate Blog Post text using the AI text-generation endpoint.
 */
export const useGenerateBlogPost = (): MutationWithIsLoading<
  string,
  HttpErrorResponse,
  string
> => {
  const mutation = useMutation<string, HttpErrorResponse, string>({
    mutationFn: async (prompt: string) => {
      const response = await httpClient.post(
        '/api/text-generation/blogpost',
        { prompt },
        { responseType: 'text' }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      showToast(
        `AI generation (Blog Post) succeeded for prompt: ${variables}`,
        'success'
      );
    },
    onError: (error) => {
      const errorMessage = error?.message ?? 'Unknown error';
      showToast(
        `Error generating Blog Post text: ${errorMessage}`,
        'error'
      );
    },
  });

  return {
    ...mutation,
    isLoading: mutation.status === 'pending',
  };
};