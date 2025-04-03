'use client';

import Container from '@/components/container';
import { Separator } from '@/components/ui/separator';

import { UserResponse } from '@/models/user/UserResponse';

import { UpdatePendingUserForm } from './update-password-and-role-form';

export default function PendingUserForm({ user }: { user: UserResponse }) {
  return (
    <Container size='sm' className='items-top flex justify-center p-4'>
      <div className='flex flex-col gap-y-6 rounded-lg bg-white p-6 shadow-md'>
        <h1 className='text-center text-2xl font-bold'>
          Welcome, {user.firstName}!
        </h1>

        <p className='text-md text-center leading-6 text-gray-800'>
          <span className='block'>
            We’ve sent an email to{' '}
            <strong className='text-blue-600'>{user.email}</strong> with your
            temporary secure password key.
          </span>
          <span className='mt-2 block'>
            To complete your registration, please follow the steps below:
          </span>
        </p>

        <div className='mt-2 w-full rounded-lg bg-gray-50 p-4 shadow-sm'>
          <ol className='list-inside list-decimal space-y-2 text-gray-700'>
            <li>
              <span className='font-medium'>Create your password</span>
            </li>
            <li>
              <span className='font-medium'>Choose your role</span> as either
              <strong className='text-yellow-600'> CLIENT</strong> or
              <strong className='text-blue-600'> FREELANCER</strong>.
            </li>
          </ol>
        </div>

        <p className='mt-2 text-center text-sm leading-relaxed text-gray-600'>
          Use the form below to update your details and activate your account.
        </p>

        <UpdatePendingUserForm />
        <Separator />
      </div>
    </Container>
  );
}
