'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import httpClient from '@/lib/httpClient';

import ErrorFeedback from '@/components/error-feedback';
import SuccessFeedback from '@/components/success-feedback';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HttpErrorResponse } from '@/constants/models/http/HttpErrorResponse';
import { cn } from '@/util/utils';
import { RegistrationUserType } from '@/app/(without-main-layout)/auth/register/page';
import { Role } from '@/constants/models/user/UserResponse';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { getProviderLoginUrl } from '@/app/(without-main-layout)/auth/login/components/user-auth-form';

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement> & {
  userRole: RegistrationUserType;
};

const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    passwordConfirmation: z.string().min(8),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    role: z.string().optional(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  });

const getPropsFromUserRole = (userRole: Role.CLIENT | Role.FREELANCER) => {
  switch (userRole) {
    case Role.CLIENT:
      return {
        title: 'Sign up as a client',
        linkText: 'Apply as a freelancer',
      };
    case Role.FREELANCER:
      return {
        title: 'Sign up as a freelancer',
        linkText: 'Join as a client',
      };
  }
};

type Schema = z.infer<typeof registerSchema>;
export function UserRegisterForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<HttpErrorResponse | undefined>(
    undefined
  );

  async function onSubmit(data: Schema) {
    setErrors(undefined);
    setSuccess(false);
    setIsLoading(true);
    // Add role to the data
    data.role = props.userRole;
    httpClient
      .post('/api/users', data)
      .then(() => {
        toast.success('Account created successfully');
        setSuccess(true);
      })
      .catch((error) => {
        const errData = error.response.data as HttpErrorResponse;
        setErrors(errData);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const { register, handleSubmit, formState } = useForm<Schema>({
    resolver: zodResolver(registerSchema),
    reValidateMode: 'onSubmit',
  });

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <SuccessFeedback
        show={success}
        message='Account created'
        description='Verfication email will be sent to your inbox, please click the link in the email to verify your account'
        action={
          <Link href='/auth/login' className='underline'>
            Login
          </Link>
        }
      />
      <div className='flex flex-col gap-4 sm:flex-row'>
        <Link href={getProviderLoginUrl('github')} className={'w-full'}>
          <Button
            variant='outline'
            type='button'
            disabled={isLoading}
            className='w-full'
          >
            <FaGithub className='mr-2 h-4 w-4' />
            GitHub
          </Button>
        </Link>

        <Link href={getProviderLoginUrl('google')} className={'w-full'}>
          <Button
            variant='outline'
            type='button'
            disabled={isLoading}
            className='w-full'
          >
            <FaGoogle className='mr-2 h-4 w-4' />
            Google
          </Button>
        </Link>
      </div>

      <div className='relative my-2'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='text-muted-foreground bg-white px-2'>
            Or continue with
          </span>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid gap-2'>
          <div className='grid gap-3'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='grid gap-2'>
                <div>
                  <Label htmlFor='firstName'>First name</Label>
                  <Input
                    id='firstName'
                    type='text'
                    autoCapitalize='none'
                    autoCorrect='off'
                    disabled={isLoading}
                    {...register('firstName')}
                  />
                </div>
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='lastName'>Last name</Label>
                <Input
                  id='lastName'
                  type='text'
                  autoCapitalize='none'
                  autoCorrect='off'
                  disabled={isLoading}
                  {...register('lastName')}
                />
              </div>
            </div>

            <div>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                placeholder='name@example.com'
                type='text'
                autoCapitalize='none'
                autoComplete='email'
                autoCorrect='off'
                disabled={isLoading}
                {...register('email')}
              />
              {formState.errors.email && (
                <small className='text-red-600'>
                  {formState.errors.email.message}
                </small>
              )}
            </div>

            <div>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                autoCapitalize='none'
                autoCorrect='off'
                disabled={isLoading}
                {...register('password')}
              />
              {formState.errors.password && (
                <small className='text-red-600'>
                  {formState.errors.password.message}
                </small>
              )}
            </div>

            <div>
              <Label htmlFor='passwordConfirmation'>Confirm password</Label>
              <Input
                id='passwordConfirmation'
                type='password'
                disabled={isLoading}
                {...register('passwordConfirmation')}
              />
              {formState.errors.passwordConfirmation && (
                <small className='text-red-600'>
                  {formState.errors.passwordConfirmation.message}
                </small>
              )}
            </div>
          </div>

          <ErrorFeedback data={errors} />

          <Button
            className={'mt-6'}
            disabled={isLoading}
            animation={{
              hoverTextColor: 'text-n700',
              overlayColor: 'bg-yellow-400',
            }}
            bgColor={'n900'}
            type='submit'
          >
            {isLoading && 'Creating account...'}
            Register
          </Button>
        </div>
      </form>
    </div>
  );
}
