'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import httpClient from '../lib/httpClient';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { HttpErrorResponse } from '@/constants/models/http/HttpErrorResponse';

interface AuthProps {
  middleware?: 'auth' | 'guest';
  redirectIfAuthenticated?: string;
}

interface LoginProps {
  email: string;
  password: string;
}

export const useAuthGuard = ({
  middleware,
  redirectIfAuthenticated,
}: AuthProps) => {
  const router = useRouter();

  const {
    data: userData,
    error,
    refetch,
    isLoading: isUserLoading,
  } = useQuery({
    queryKey: ['auth-me'],
    queryFn: () => httpClient.get('/api/auth/me'),
    staleTime: 1000 * 60 * 60 * 4, // 4 hours
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: (props: LoginProps) =>
      httpClient.post('/api/auth/login', props),
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      if (error?.response?.data) {
        const serverError = error.response.data as HttpErrorResponse;
        toast.error(serverError.message);
      } else {
        toast.error('An unknown error occurred');
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => httpClient.post('/api/auth/logout'),
    onSuccess: () => {
      toast.success('Logged out successfully');
      if (typeof window !== 'undefined') {
        window.location.pathname = '/auth/login';
      }
    },
  });

  useEffect(() => {
    // If middleware is 'guest' and we have a user, redirect
    if (middleware === 'guest' && redirectIfAuthenticated && userData) {
      router.push(redirectIfAuthenticated);
    }

    // If middleware is 'auth' and we have an error, logout
    if (middleware === 'auth' && error) {
      logoutMutation.mutate();
    }
  }, [
    userData,
    error,
    middleware,
    redirectIfAuthenticated,
    router,
    logoutMutation,
  ]);

  return {
    user: userData?.data,
    isUserLoading,
    login: loginMutation,
    logout: logoutMutation,
    mutate: refetch,
  };
};
