'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import ErrorFeedback from '@/components/error-feedback';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HttpErrorResponse } from '@/constants/models/http/HttpErrorResponse';
import { useAuthGuard } from '@/api/auth-api';
import Link from 'next/link';
import { FaGithub, FaGoogle } from 'react-icons/fa';

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export function getProviderLoginUrl(
  provider: 'google' | 'facebook' | 'github' | 'okta'
) {
  return process.env.NEXT_PUBLIC_BASE_URL + `/oauth2/authorization/${provider}`;
}

type Schema = z.infer<typeof loginFormSchema>;
export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const { login, isLoginLoading: isLoading } = useAuthGuard({
    middleware: 'guest',
    redirectIfAuthenticated: '/dashboard',
  });
  const [errors, setErrors] = React.useState<HttpErrorResponse | undefined>(
    undefined
  );

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

  const { register, handleSubmit, formState } = useForm<Schema>({
    resolver: zodResolver(loginFormSchema),
    reValidateMode: 'onSubmit',
  });

  return (
    <div className='grid gap-6'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid gap-5'>
          <SocialAuthLogins isLoading={isLoading} />
          <div className='grid gap-4'>
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
          </div>

          <ErrorFeedback data={errors} />

          <Button
            disabled={isLoading}
            type='submit'
            variant={'footerColor'}
            className={'mt-6'}
          >
            {isLoading ? 'Signing in...' : 'Sign In with Email'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export const SocialAuthLogins = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <>
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
    </>
  );
};
