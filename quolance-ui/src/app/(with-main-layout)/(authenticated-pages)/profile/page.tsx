'use client';

import { Separator } from '@radix-ui/react-separator';
import { format } from 'date-fns';
import React from 'react';
import { FaFacebook, FaGithub, FaGoogle } from 'react-icons/fa';

import { useAuthGuard } from '@/api/auth-api';

import Container from '@/components/container';
import Loading from '@/components/loading';

import UpdateBasicDetailsForm from './components/update-basic-details-form';
import UpdatePasswordForm from './components/update-password-form';

export default function ProfilePage() {
  const { user } = useAuthGuard({ middleware: 'auth' });

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google':
        return <FaGoogle />;
      case 'github':
        return <FaGithub />;
      case 'facebook':
        return <FaFacebook />;
      case 'okta':
        return <span>Okta</span>;
      default:
        return <span>{provider}</span>;
    }
  };

  if (!user) return <Loading />;

  return (
    <Container size='sm' className='items-top flex justify-center p-4'>
      <div className='flex flex-col gap-y-4'>
        <h1 className='text-2xl font-semibold'>
          Welcome back, {user.firstName}
        </h1>

        <UpdateBasicDetailsForm />
        <Separator />

        <UpdatePasswordForm />
        <Separator />

        <h2 className='mb-2 text-lg font-semibold'>Connected Accounts</h2>
        <div className='flex flex-col gap-y-2'>
          {(user?.connectedAccounts ?? []).map((account, index) => (
            <div
              className='flex w-full max-w-screen-sm justify-between'
              key={index}
            >
              <div className='flex items-center gap-x-2'>
                {getProviderIcon(account.provider)}
                <span className='font-bold'>{account.provider}</span>
              </div>
              <span className='text-muted-foreground'>
                Connected at:{' '}
                <span className='text-foreground font-semibold'>
                  {format(new Date(account.connectedAt), 'MMM dd, hh:mm')}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
