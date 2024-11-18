'use client';

import Loading from '@/components/loading';
import VerificationNotice from '@/components/verify-account';

import { useAuthGuard } from '@/api/auth-api';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthGuard({ middleware: 'auth' });

  if (!user) return <Loading />;

  if (!user?.verified) return <VerificationNotice />;

  return <>{children}</>;
}
