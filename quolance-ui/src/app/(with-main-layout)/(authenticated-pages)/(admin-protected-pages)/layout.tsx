'use client';

import { useAuthGuard } from '@/api/auth-api';
import Loading from '@/components/ui/loading/loading';
import PermissionGuard from '@/components/permission-guard';
import RoleGuard from '@/components/role-guard';
import { Role } from '@/constants/models/user/UserResponse';
import { ProjectProvider } from './AdminContext/ProjectContext'
import { ReportedBlogProvider } from './AdminContext/ReportedBlogContext';
import { ResolvedBlogProvider } from './AdminContext/ResolvedBlogContext';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthGuard({ middleware: 'auth' });

  if (!user) return <Loading />;

  return (
    <>
      <ProjectProvider>
        <ReportedBlogProvider>
          <ResolvedBlogProvider>
            <PermissionGuard rolesAllowed={[Role.ADMIN]} />
            <RoleGuard rolesAllowed={[Role.ADMIN]}>
              {children}
            </RoleGuard>
          </ResolvedBlogProvider>
        </ReportedBlogProvider>
      </ProjectProvider>
    </>
  );
}
