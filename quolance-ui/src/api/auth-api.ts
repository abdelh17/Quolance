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

const USER_STORAGE_KEY = 'userData';

export const useAuthGuard = ({
  middleware,
  redirectIfAuthenticated,
}: AuthProps) => {
  const router = useRouter();

  const getSessionUserData = () => {
    const storedData = sessionStorage.getItem(USER_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : undefined;
  };

  const {
    data: userData,
    error,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ['auth-me'],
    queryFn: () => httpClient.get('/api/auth/me'),
    staleTime: 1000 * 60 * 60 * 4, // 4 hours
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    initialData: getSessionUserData(),
    retry: false,
  });

  useEffect(() => {
    if (isSuccess && userData) {
      sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    }
  }, [isSuccess, userData]);

  const loginMutation = useMutation({
    mutationFn: (props: LoginProps) =>
      httpClient.post('/api/auth/login', props),
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      if (error && error.response && error.response.data) {
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
      sessionStorage.removeItem(USER_STORAGE_KEY);
      window.location.pathname = '/auth/login';
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
  }, [userData, error]);

  return {
    user: userData?.data,
    login: loginMutation,
    logout: logoutMutation,
    mutate: refetch,
  };
};
