'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import httpClient from '@/lib/httpClient';

import ErrorFeedback from '@/components/error-feedback';
import SuccessFeedback from '@/components/success-feedback';
import { Button } from '@/components/ui/button';

import { FormInput } from '@/app/(without-main-layout)/auth/shared/auth-components';
import { HttpErrorResponse } from '@/models/http/HttpErrorResponse';

const verificationFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  verificationCode: z
    .string()
    .min(6, 'Verification code must be at least 6 characters'),
});

type VerificationSchema = z.infer<typeof verificationFormSchema>;

export function VerificationForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();
  const [success, setSuccess] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<HttpErrorResponse | undefined>(
    undefined
  );
  const [countdown, setCountdown] = React.useState(3);
  const [redirecting, setRedirecting] = React.useState(false);

  const { register, handleSubmit, formState } = useForm<VerificationSchema>({
    resolver: zodResolver(verificationFormSchema),
    reValidateMode: 'onSubmit',
  });

  React.useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (redirecting && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      router.push('/auth/login');
      if (timer) clearInterval(timer);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown, redirecting, router]);

  async function onSubmit(data: VerificationSchema) {
    setErrors(undefined);
    setIsLoading(true);

    httpClient
      .post('/api/users/verify-email', data)
      .then((response) => {
        setSuccess(true);
        setRedirecting(true);
      })
      .catch((error) => {
        setSuccess(false);
        const errData = error.response.data as HttpErrorResponse;
        if (errData.message === 'Email already verified') {
          setErrors({
            ...errData,
            message: 'Email already verified, please log in.',
          });
          setRedirecting(true);
        } else {
          setErrors(errData);
          toast.error(errData.message || 'Verification failed');
        }
        console.log(errData);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className='grid gap-6'>
      <SuccessFeedback
        show={success}
        message='Account verified successfully'
        description='You can now login with your email and password.'
        action={
          <Link href='/auth/login' className='underline'>
            Login
          </Link>
        }
        data-test='success-message'
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid gap-4'>
          <FormInput
            id='email'
            label='Email'
            type='email'
            placeholder='name@example.com'
            isLoading={isLoading}
            register={register}
            error={formState.errors.email?.message}
            autoComplete='email'
            data-test='email-input'
          />
          <FormInput
            id='verificationCode'
            label='Verification Code'
            type='text'
            placeholder='Enter verification code'
            isLoading={isLoading}
            register={register}
            error={formState.errors.verificationCode?.message}
            data-test='verification-code-input'
          />

          <ErrorFeedback data-test='error-message' data={errors} />

          <Button
            disabled={isLoading}
            type='submit'
            className='mt-6 py-4'
            variant='default'
            data-test='verify-submit'
          >
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </Button>
        </div>
      </form>

      {(redirecting || success) && (
        <div className='mt-4 text-sm text-gray-500'>
          You will be redirected to the login page in {countdown}...
        </div>
      )}
    </div>
  );
}
