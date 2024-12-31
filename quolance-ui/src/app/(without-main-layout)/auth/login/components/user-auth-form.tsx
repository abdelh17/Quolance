'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import ErrorFeedback from '@/components/error-feedback';
import { Button } from '@/components/ui/button';
import { HttpErrorResponse } from '@/constants/models/http/HttpErrorResponse';
import { useAuthGuard } from '@/api/auth-api';
import {
  FormInput,
  SocialAuthLogins,
} from '@/app/(without-main-layout)/auth/shared/auth-components';

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type Schema = z.infer<typeof loginFormSchema>;

export function UserAuthForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {

  const { user } = useAuthGuard({ middleware: 'auth' });

  const { login, isLoginLoading: isLoading } = useAuthGuard({
    middleware: 'guest',
    redirectIfAuthenticated: user?.role == 'ADMIN' ? '/adminDashboard' : '/dashboard',
  });

  const [errors, setErrors] = React.useState<HttpErrorResponse | undefined>(
    undefined
  );

  const { register, handleSubmit, formState } = useForm<Schema>({
    resolver: zodResolver(loginFormSchema),
    reValidateMode: 'onSubmit',
  });

  async function onSubmit(data: Schema) {
    try {
      await login({
        onError: (errors) => {
          if (errors) {
            setErrors(errors);
            toast.error('Authentication failed');
          }
        },
        props: data,
      });
    } catch (error) {
      console.error(error);
      toast.error('Authentication failed');
    }
  }

  return (
    <div className='grid gap-6'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid gap-5'>
          <SocialAuthLogins isLoading={isLoading} />
          <div className='grid gap-4'>
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
          </div>

          <ErrorFeedback data={errors} />

          <Button
            disabled={isLoading}
            type='submit'
            className='mt-6 py-4'
            variant={'default'}
          >
            {isLoading ? 'Signing in...' : 'Sign In with Email'}
          </Button>
        </div>
      </form>
    </div>
  );
}
