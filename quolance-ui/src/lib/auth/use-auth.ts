import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

import { HttpErrorResponse } from "@/models/http/HttpErrorResponse";
import { UserResponse } from "@/models/user/UserResponse";

import httpClient from "../httpClient";

interface AuthProps {
  middleware?: "auth" | "guest";
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
  } = useSWR("http://localhost:8080/api/auth/me", () =>
    httpClient.get<UserResponse>("http://localhost:8080/api/auth/me").then((res) => res.data)
  );

  const login = async ({
    onError,
    props,
  }: {
    onError: (errors: HttpErrorResponse | undefined) => void;
    props: any;
  }) => {
    onError(undefined);
    // await csrf(); temporarly commented out to make the form work
    httpClient
      .post<HttpErrorResponse>("http://localhost:8080/api/auth/login", {
        email: props.email,
        password: props.password,
      })
      .then(() => mutate())
      .catch((err) => {
        const errors = err.response.data as HttpErrorResponse;
        onError(errors);
      });
  };

  // const csrf = async () => {
  //   await httpClient.get("/api/auth/csrf")
  // }

  const logout = async () => {
    if (!error) {
      await httpClient.post("http://localhost:8080/api/auth/logout").then(() => mutate());
    }

    window.location.pathname = "/auth/login";
  };

  useEffect(() => {
    // If middleware is 'guest' and we have a user, redirect
    if (middleware === "guest" && redirectIfAuthenticated && user) {
      router.push(redirectIfAuthenticated);
    }

    // If middleware is 'auth' and we have an error, logout
    if (middleware === "auth" && error) {
      logout();
    }
  }, [user, error]);

  return {
    user,
    login,
    logout,
    mutate
  };
};
