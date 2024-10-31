"use client";

import React from "react";
import { FaFacebook, FaGithub, FaGoogle } from "react-icons/fa";

import { useAuthGuard } from "@/lib/auth/use-auth";

import Container from "@/components/container";
import Loading from "@/components/loading";

export default function ProfilePage() {
  const { user } = useAuthGuard({ middleware: "auth" });

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "google":
        return <FaGoogle />;
      case "github":
        return <FaGithub />;
      case "facebook":
        return <FaFacebook />;
      case "okta":
        return <span>Okta</span>;
      default:
        return <span>{provider}</span>;
    }
  };

  if (!user) return <Loading />;

  return (
    <Container size="sm">
      <div className="flex flex-col gap-y-4">
        <h1 className="text-2xl font-semibold">Welcome back, {user.firstName}</h1>
        <h2 className="text-lg font-semibold mb-2">Connected Accounts</h2>
        <div className="flex flex-col gap-y-2">
          Temp
        </div>
      </div>
    </Container>
  );
}
