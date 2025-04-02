'use client';

import Link from 'next/link';
import { UseFormRegister } from 'react-hook-form';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { cn } from '@/util/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  className?: string; // Added className prop
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
  className,
  ...rest
}: FormInputProps) => (
  <div {...rest}>
    <Label htmlFor={id} className="mb-1.5 block">{label}</Label>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      autoCapitalize="none"
      autoCorrect="off"
      autoComplete={autoComplete}
      disabled={isLoading}
      className={cn(className)}
      {...register(id)}
    />
    {error && <small className="text-red-600 mt-1 block">{error}</small>}
  </div>
);

export const SocialAuthLogins = ({ isLoading }: { isLoading: boolean }) => (
  <>
    <div className="flex flex-col gap-4 sm:flex-row">
      {/* <Link href={getProviderLoginUrl('github')} className="w-full">
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          className="w-full"
        >
          <FaGithub className="mr-2 h-4 w-4" />
          GitHub
        </Button>
      </Link> */}

      <Link href={getProviderLoginUrl('google')} className="w-full">
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          className="w-full bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:text-gray-900 font-medium py-5"
        >
          <FaGoogle className="mr-2 h-4 w-4 text-indigo-500" />
          Continue with Google
        </Button>
      </Link>
    </div>

    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-gray-200" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="text-gray-500 bg-white px-4">
          Or continue with email
        </span>
      </div>
    </div>
  </>
);