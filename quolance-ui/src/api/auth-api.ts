'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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

// Safe storage helper
const safeStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(key);
    }
  },
};

export const useAuthGuard = ({
  middleware,
  redirectIfAuthenticated,
}: AuthProps) => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  const getSessionUserData = () => {
    const storedData = safeStorage.getItem(USER_STORAGE_KEY);
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
    initialData: isClient ? getSessionUserData() : undefined,
    retry: false,
    enabled: isClient, // Only run query on client side
  });

  useEffect(() => {
    if (isSuccess && userData) {
      safeStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    }
  }, [isSuccess, userData]);

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
      safeStorage.removeItem(USER_STORAGE_KEY);
      if (typeof window !== 'undefined') {
        window.location.pathname = '/auth/login';
      }
    },
  });

  useEffect(() => {
    if (!isClient) return;

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
    isClient,
    middleware,
    redirectIfAuthenticated,
    router,
    logoutMutation,
  ]);

  return {
    user: userData?.data,
    login: loginMutation,
    logout: logoutMutation,
    mutate: refetch,
  };
};
