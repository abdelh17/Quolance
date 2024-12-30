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
import { HttpErrorResponse } from '@/constants/models/http/HttpErrorResponse';
import { cn } from '@/util/utils';
import { RegistrationUserType } from '@/app/(without-main-layout)/auth/register/page';
import { Role } from '@/constants/models/user/UserResponse';
import {
  FormInput,
  SocialAuthLogins,
} from '@/app/(without-main-layout)/auth/shared/auth-components';

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

type Schema = z.infer<typeof registerSchema>;

export function UserRegisterForm({
  className,
  userRole,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<HttpErrorResponse | undefined>(
    undefined
  );

  const { register, handleSubmit, formState } = useForm<Schema>({
    resolver: zodResolver(registerSchema),
    reValidateMode: 'onSubmit',
  });

  async function onSubmit(data: Schema) {
    setErrors(undefined);
    setSuccess(false);
    setIsLoading(true);
    data.role = userRole;

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
      <SocialAuthLogins isLoading={isLoading} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid gap-2'>
          <div className='grid gap-3'>
            <div className='grid grid-cols-2 gap-4'>
              <FormInput
                id='firstName'
                label='First name'
                type='text'
                isLoading={isLoading}
                register={register}
              />
              <FormInput
                id='lastName'
                label='Last name'
                type='text'
                isLoading={isLoading}
                register={register}
              />
            </div>

            <FormInput
              id='email'
              label='Email'
              type='text'
              placeholder='name@example.com'
              isLoading={isLoading}
              register={register}
              error={formState.errors.email?.message}
              autoComplete='email'
            />

            <FormInput
              id='password'
              label='Password'
              type='password'
              isLoading={isLoading}
              register={register}
              error={formState.errors.password?.message}
            />

            <FormInput
              id='passwordConfirmation'
              label='Confirm password'
              type='password'
              isLoading={isLoading}
              register={register}
              error={formState.errors.passwordConfirmation?.message}
            />
          </div>

          <ErrorFeedback data={errors} />

          <Button
            className='mt-6'
            disabled={isLoading}
            animation={'default'}
            type='submit'
          >
            {isLoading
              ? 'Creating account...'
              : userRole === Role.CLIENT
              ? 'Register as a client'
              : 'Register as a freelancer'}
          </Button>
        </div>
      </form>
    </div>
  );
}
