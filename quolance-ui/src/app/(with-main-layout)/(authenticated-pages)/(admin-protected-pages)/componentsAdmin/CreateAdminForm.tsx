'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import ErrorFeedback from '@/components/error-feedback';
import SuccessFeedback from '@/components/success-feedback';
import httpClient from '@/lib/httpClient';
import { HttpErrorResponse } from '@/constants/models/http/HttpErrorResponse';
import { showToast } from '@/util/context/ToastProvider';
import { cn } from '@/util/utils';

const createAdminSchema = z
  .object({
    email: z.string().email(),
    temporaryPassword: z.string().min(8),
    passwordConfirmation: z.string().min(8),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  })
  .refine((data) => data.temporaryPassword === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  });

type CreateAdminSchema = z.infer<typeof createAdminSchema>;

export function CreateAdminForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { register, handleSubmit, formState } = useForm<CreateAdminSchema>({
    resolver: zodResolver(createAdminSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<HttpErrorResponse | undefined>(
    undefined
  );
  const router = useRouter();

  async function onSubmit(data: CreateAdminSchema) {
    setErrors(undefined);
    setSuccess(false);
    setIsLoading(true);

    httpClient
      .post('/api/users/admin', data)
      .then(() => {
        showToast('New admin created successfully', 'success');

        router.push('/adminDashboard');

        setSuccess(true);
      })
      .catch((error) => {
        const errData = error.response.data as HttpErrorResponse;
        setErrors(errData);
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <SuccessFeedback
        show={success}
        message='Admin Created'
        description='You have successfully created a new admin.'
      />

      <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4'>
        <div className='grid gap-2'>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            placeholder="Enter Admin's Email"
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

          <Label htmlFor='temporaryPassword'>Temporary Password</Label>
          <Input
            id='temporaryPassword'
            placeholder="Enter Admin's Temporary Password"
            type='password'
            disabled={isLoading}
            {...register('temporaryPassword')}
          />
          {formState.errors.temporaryPassword && (
            <small className='text-red-600'>
              {formState.errors.temporaryPassword.message}
            </small>
          )}

          <Label htmlFor='passwordConfirmation'>
            Confirm Temporary Password
          </Label>
          <Input
            id='passwordConfirmation'
            placeholder="Confirm Admin's Temporary Password"
            type='password'
            disabled={isLoading}
            {...register('passwordConfirmation')}
          />
          {formState.errors.passwordConfirmation && (
            <small className='text-red-600'>
              {formState.errors.passwordConfirmation.message}
            </small>
          )}

          <Label htmlFor='firstName'>First Name</Label>
          <Input
            id='firstName'
            placeholder="Enter Admin's First Name"
            type='text'
            disabled={isLoading}
            {...register('firstName')}
          />

          <Label htmlFor='lastName'>Last Name</Label>
          <Input
            id='lastName'
            placeholder="Enter Admin's Last Name"
            type='text'
            disabled={isLoading}
            {...register('lastName')}
          />
        </div>

        <ErrorFeedback data={errors} />

        <Button type='submit' disabled={isLoading} variant={'footerColor'}>
          {isLoading ? 'Creating Admin...' : 'Create Admin'}
        </Button>
      </form>
    </div>
  );
}
