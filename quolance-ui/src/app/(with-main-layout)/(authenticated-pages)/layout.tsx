"use client";

import { useAuthGuard } from "@/lib/auth/use-auth";

import Loading from "@/components/loading";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthGuard({ middleware: "auth" });

  if (!user) return <Loading />;

  return (
    <>
      {children}
    </>
  );
}
