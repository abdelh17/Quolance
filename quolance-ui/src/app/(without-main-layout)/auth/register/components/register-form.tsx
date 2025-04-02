'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import Link from 'next/link';
import React from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import {z} from 'zod';

import httpClient from '@/lib/httpClient';
import ErrorFeedback from '@/components/error-feedback';
import SuccessFeedback from '@/components/success-feedback';
import {Button} from '@/components/ui/button';
import {HttpErrorResponse} from '@/models/http/HttpErrorResponse';
import {cn} from '@/util/utils';
import {RegistrationUserType} from '@/app/(without-main-layout)/auth/register/page';
import {Role} from '@/models/user/UserResponse';
import {FormInput, SocialAuthLogins,} from '@/app/(without-main-layout)/auth/shared/auth-components';
import PasswordRequirements from './PasswordRequirement';
import PasswordStrengthBar from '@/app/(with-main-layout)/(authenticated-pages)/setting/components/PasswordStrengthBar';


type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement> & {
  userRole: RegistrationUserType;
};



const registerSchema = z
  .object({
    email: z.string().email(),
    username: z.string().min(8, 'Username must be at least 8 characters'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
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

  const { register, handleSubmit, formState, watch } = useForm<Schema>({
    resolver: zodResolver(registerSchema),
    reValidateMode: 'onSubmit',
  });

  const password = watch('password');

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
        description='An email verification code has been sent to your inbox. Please enter the code to verify your account. Check your spam folder if you do not find it!'
        action={
          <Link href={`/auth/verify-email/${watch('email')}`} className='underline'>
            Verify Email
          </Link>
        }
        data-test='success-message'
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
                data-test='firstName-input'
              />
              <FormInput
                id='lastName'
                label='Last name'
                type='text'
                isLoading={isLoading}
                register={register}
                data-test='lastName-input'
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
              data-test='email-input'
            />

            <FormInput
              id='username'
              label='Username'
              type='text'
              placeholder='johndoe99'
              isLoading={isLoading}
              register={register}
              error={formState.errors.username?.message}
              autoComplete='username'
              data-test='username-input'
            />

            <FormInput
              id='password'
              label='Password'
              type='password'
              isLoading={isLoading}
              register={register}
              error={formState.errors.password?.message}
              data-test='password-input'
            />

            {password?.length > 0 && <PasswordStrengthBar password={password} />}
            <PasswordRequirements password={password} />

            <FormInput
              id='passwordConfirmation'
              label='Confirm password'
              type='password'
              isLoading={isLoading}
              register={register}
              error={formState.errors.passwordConfirmation?.message}
              data-test='passwordConfirm-input'
            />
          </div>

          <ErrorFeedback data-test='error-message' data={errors} />

          <Button
            className='mt-6'
            disabled={isLoading}
            animation={'default'}
            type='submit'
            data-test='register-submit'
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
