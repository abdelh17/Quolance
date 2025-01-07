'use client';

import { useAuthGuard } from '@/api/auth-api';

import Loading from '@/components/ui/loading/loading';
import PermissionGuard from '@/components/permission-guard';
import RoleGuard from '@/components/role-guard';
import { Role } from '@/constants/models/user/UserResponse';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthGuard({ middleware: 'auth' });

  if (!user) return <Loading />;

  return (
    <>
      <PermissionGuard rolesAllowed={[Role.CLIENT]}></PermissionGuard>
      <RoleGuard rolesAllowed={[Role.CLIENT]}>{children}</RoleGuard>
    </>
  );
}
