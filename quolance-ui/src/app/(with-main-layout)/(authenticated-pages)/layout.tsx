'use client';

import Loading from '@/components/ui/loading/loading';
import VerificationNotice from '@/components/verify-account';

import { useAuthGuard } from '@/api/auth-api';
import { Role } from '@/models/user/UserResponse';

import PendingUserForm from './components/pending-user-form';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuthGuard({ middleware: 'auth' });

  if (!user) return <Loading />;

  if (!user?.verified) return <VerificationNotice logout={logout} />;

  if (user?.role === Role.PENDING) return <PendingUserForm user={user} />;

  return <>{children}</>;
}
