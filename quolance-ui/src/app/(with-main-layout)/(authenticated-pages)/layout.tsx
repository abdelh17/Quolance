'use client';

import Loading from '@/components/ui/loading/loading';
import VerificationNotice from '@/components/verify-account';

import {useAuthGuard} from '@/api/auth-api';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuthGuard({ middleware: 'auth' });

  if (!user) return <Loading />;

  if (!user?.verified) return <VerificationNotice logout={logout} />;


  return <>{children}</>;
}
