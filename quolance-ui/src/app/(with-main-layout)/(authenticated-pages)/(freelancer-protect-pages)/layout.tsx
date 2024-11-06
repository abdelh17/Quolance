"use client";

import { useAuthGuard } from "@/lib/auth/use-auth";

import Loading from "@/components/loading";
import PermissionGuard from "@/components/permission-guard";
import RoleGuard from "@/components/role-guard";

import { Role } from "@/models/user/UserResponse";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthGuard({ middleware: "auth" });

  if (!user) return <Loading />;

  return (
    <>
      <PermissionGuard rolesAllowed={[Role.FREELANCER]}></PermissionGuard>
      <RoleGuard rolesAllowed={[Role.FREELANCER]}>
        {children}
      </RoleGuard>
    </>
  );
}
