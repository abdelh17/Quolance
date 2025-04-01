import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import httpClient from '@/lib/httpClient';

import { HttpErrorResponse } from '@/models/http/HttpErrorResponse';
import { UserResponse } from '@/models/user/UserResponse';

interface AuthProps {
  middleware?: 'auth' | 'guest';
  redirectIfAuthenticated?: string;
}

export const useAuthGuard = ({
  middleware,
  redirectIfAuthenticated,
}: AuthProps) => {
  const router = useRouter();

  const {
    data: user,
    error,
    mutate,
    isLoading,
  } = useSWR('/api/auth/me', () =>
    httpClient.get<UserResponse>('/api/auth/me').then((res) => res.data)
  );

  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const login = async ({
    onError,
    props,
  }: {
    onError: (errors: HttpErrorResponse | undefined) => void;
    props: any;
  }) => {
    try {
      setIsLoginLoading(true);
      onError(undefined);
      await httpClient
        .post<HttpErrorResponse>('/api/auth/login', {
          username: props.email,
          password: props.password,
        })
        .then(() => mutate())
        .catch((err) => {
          const errors = err.response.data as HttpErrorResponse;
          onError(errors);
        });
    } finally {
      setIsLoginLoading(false);
    }
  };

  const logout = async () => {
    if (!error) {
      await httpClient.post('/api/auth/logout').then(() => mutate());
    }

    window.location.pathname = '/auth/login';
  };

  useEffect(() => {
    if (!isLoading) {
      // Only run redirects after loading is complete
      if (middleware === 'guest' && redirectIfAuthenticated && user) {
        router.push(redirectIfAuthenticated);
      }

      if (middleware === 'auth' && error && user) {
        logout();
      }
    }
  }, [user, error, isLoading]);

  return {
    user,
    login,
    logout,
    mutate,
    isLoading,
    isLoginLoading,
  };
};
