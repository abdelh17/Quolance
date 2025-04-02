'use client';

import Link from 'next/link';

import {UserAuthForm} from './components/user-auth-form';
import AuthHeader from '@/app/(without-main-layout)/auth/register/components/AuthHeader';
import * as React from 'react';

export default function LoginPage() {
  return (
    <>
      <AuthHeader userRole={undefined} />
      <div className='mx-auto mt-4 flex h-full min-w-52 max-w-screen-sm flex-col justify-center space-y-6 pt-24 md:mt-0 pb-6'>
        <div className='rounded-3xl border p-6'>
          <div className='my-6 flex flex-col space-y-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Login to your account
            </h1>
            <p className='text-muted-foreground text-sm'>
              Enter your email and password below to login to your account
            </p>
          </div>
          <UserAuthForm />
          <div className='relative my-10'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='text-muted-foreground bg-white px-2'>
                Don't have a Quolance account?
              </span>
            </div>
          </div>
          <p className='flex justify-center gap-x-2 pb-4'>
            <Link
              href='/auth/register'
              className='rounded-lg border px-8 py-2 text-center transition-colors hover:bg-gray-50'
            >
              Register now
            </Link>
          </p>
        </div>

        <p className='!mt-8 flex justify-center gap-x-2'>
          Forgot your password?
          <Link
            href='/auth/forgot-password'
            className='underline underline-offset-4'
          >
            Request password reset
          </Link>
        </p>

        <p className='text-muted-foreground !mt-4 px-8 text-center text-sm'>
          By clicking continue, you agree to our{' '}
          <Link
            href='/support/terms-of-service'
            className='hover:text-primary underline underline-offset-4'
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href='/support/privacy-policy'
            className='hover:text-primary underline underline-offset-4'
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </>
  );
}
