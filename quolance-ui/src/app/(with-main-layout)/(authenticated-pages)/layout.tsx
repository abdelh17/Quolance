'use client';

import { Separator } from '@radix-ui/react-dropdown-menu';

import Container from '@/components/container';
import Loading from '@/components/loading';
import VerificationNotice from '@/components/verify-account';

import { useAuthGuard } from '@/api/auth-api';
import { Role } from '@/constants/models/user/UserResponse';

import { UpdatePendingUserForm } from './components/update-password-and-role-form';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuthGuard({ middleware: 'auth' });

  if (!user) return <Loading />;

  if (!user?.verified) return <VerificationNotice logout={logout} />;

  if (user?.role === Role.PENDING) return (
    <Container size='sm' className='items-top flex justify-center p-4'>
      <div className='flex flex-col gap-y-6 bg-white p-6 rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold text-center'>
          Welcome, {user.firstName}!
        </h1>

        <p className='text-md text-gray-800 text-center leading-6'>
          <span className='block'>
            We’ve sent an email to <strong className='text-blue-600'>{user.email}</strong> with your temporary password.
          </span>
          <span className='block mt-2'>
            To complete your registration, please follow the steps below:
          </span>
        </p>

        <div className='bg-gray-50 p-4 rounded-lg shadow-sm w-full mt-2'>
          <ol className='list-decimal list-inside text-gray-700 space-y-2'>
            <li>
              <span className='font-medium'>Update your password</span> to something secure.
            </li>
            <li>
              <span className='font-medium'>Choose your role</span> as either
              <strong className='text-yellow-600'> CLIENT</strong> or
              <strong className='text-blue-600'> FREELANCER</strong>.
            </li>
          </ol>
        </div>

        <p className='text-sm text-gray-600 text-center mt-2 leading-relaxed'>
          Use the form below to update your details and activate your account.
        </p>

        <UpdatePendingUserForm />
        <Separator />
      </div>
    </Container>
  );

  return <>{children}</>;
}
