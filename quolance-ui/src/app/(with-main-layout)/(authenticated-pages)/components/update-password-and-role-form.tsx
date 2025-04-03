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

import { HttpErrorResponse } from '@/models/http/HttpErrorResponse';
import { cn } from '@/util/utils';
import { useAuthGuard } from '@/api/auth-api';

import PasswordRequirements from '@/app/(without-main-layout)/auth/register/components/PasswordRequirement';
import PasswordStrengthBar from '../setting/components/PasswordStrengthBar';

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

// Define schema for form validation using Zod
const updateSchema = z
  .object({
    oldPassword: z
      .string()
      .min(8, { message: 'Old password must be at least 8 characters.' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters.' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Confirm password must be at least 8 characters.' }),
    role: z
      .string()
      .nonempty('Role is required')
      .refine((value) => ['CLIENT', 'FREELANCER'].includes(value), {
        message: 'Role must be CLIENT or FREELANCER.',
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type Schema = z.infer<typeof updateSchema>;

export function UpdatePendingUserForm({
  className,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<HttpErrorResponse | undefined>(
    undefined
  );

  const { logout } = useAuthGuard({ middleware: 'auth' });

  async function onSubmit(data: Schema) {
    setErrors(undefined);
    setSuccess(false);
    setIsLoading(true);
    httpClient
      .post('/api/pending/update', data)
      .then(() => {
        toast.success('User updated successfully');
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

  const { register, handleSubmit, formState, watch } = useForm<Schema>({
    resolver: zodResolver(updateSchema),
    reValidateMode: 'onSubmit',
  });

  const password = watch('password');

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <SuccessFeedback
        show={success}
        message='User updated'
        description='Your password and role have been successfully updated.'
        action={
          <div className='underline cursor-pointer' onClick={logout}>
            Login to access your account.
          </div>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid gap-2'>
          <Label htmlFor='oldPassword'>Temporary password key (Sent in your mail) </Label>
          <Input
            id='oldPassword'
            type='password'
            autoCapitalize='none'
            autoCorrect='off'
            disabled={isLoading}
            {...register('oldPassword')}
          />
          {formState.errors.oldPassword && (
            <small className='text-red-600'>
              {formState.errors.oldPassword.message}
            </small>
          )}

          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            type='password'
            autoCapitalize='none'
            autoCorrect='off'
            disabled={isLoading}
            {...register('password')}
          />
          {password?.length > 0 && <PasswordStrengthBar password={password} />}
          <PasswordRequirements password={password} />
          {formState.errors.password && (
            <small className='text-red-600'>
              {formState.errors.password.message}
            </small>
          )}

          <Label htmlFor='confirmPassword'>Confirm Password</Label>
          <Input
            id='confirmPassword'
            type='password'
            disabled={isLoading}
            {...register('confirmPassword')}
          />
          {formState.errors.confirmPassword && (
            <small className='text-red-600'>
              {formState.errors.confirmPassword.message}
            </small>
          )}

          <Label htmlFor='role'>Role</Label>
          <select
            id='role'
            disabled={isLoading}
            {...register('role')}
            className='rounded border border-gray-300 p-2'
          >
            <option value=''>Select Role</option>
            <option value='CLIENT'>CLIENT</option>
            <option value='FREELANCER'>FREELANCER</option>
          </select>
          {formState.errors.role && (
            <small className='text-red-600'>
              {formState.errors.role.message}
            </small>
          )}

          <ErrorFeedback data={errors} />

          <Button
            className='mt-10'
            disabled={isLoading}
            type='submit'
            variant='footerColor'
          >
            {isLoading && 'Updating...'}
            {!isLoading && 'Update'}
          </Button>
        </div>
      </form>
    </div>
  );
}
