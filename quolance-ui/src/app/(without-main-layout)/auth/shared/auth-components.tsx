'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import Link from 'next/link';
import { UseFormRegister } from 'react-hook-form';

export const getProviderLoginUrl = (
  provider: 'google' | 'facebook' | 'github' | 'okta'
) => {
  return process.env.NEXT_PUBLIC_BASE_URL + `/oauth2/authorization/${provider}`;
};

interface FormInputProps {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  isLoading: boolean;
  register: UseFormRegister<any>;
  error?: string;
  autoComplete?: string;
}

export const FormInput = ({
  id,
  label,
  type,
  placeholder,
  isLoading,
  register,
  error,
  autoComplete,
}: FormInputProps) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      autoCapitalize='none'
      autoCorrect='off'
      autoComplete={autoComplete}
      disabled={isLoading}
      {...register(id)}
    />
    {error && <small className='text-red-600'>{error}</small>}
  </div>
);

export const SocialAuthLogins = ({ isLoading }: { isLoading: boolean }) => (
  <>
    <div className='flex flex-col gap-4 sm:flex-row'>
      <Link href={getProviderLoginUrl('github')} className='w-full'>
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

      <Link href={getProviderLoginUrl('google')} className='w-full'>
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
