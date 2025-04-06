'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import Link from 'next/link';
import React, {useEffect, useRef} from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import {z} from 'zod';
import {motion} from 'framer-motion';

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
  const [submittedEmail, setSubmittedEmail] = React.useState<string>('');

  // Reference for the success message element
  const successMessageRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, formState, watch, reset } = useForm<Schema>({
    resolver: zodResolver(registerSchema),
    reValidateMode: 'onSubmit',
  });

  const password = watch('password');

  // Scroll to success message when it appears
  useEffect(() => {
    if (success && successMessageRef.current) {
      successMessageRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [success]);

  async function onSubmit(data: Schema) {
    setErrors(undefined);
    setSuccess(false);
    setIsLoading(true);
    setSubmittedEmail(data.email);
    data.role = userRole;

    httpClient
      .post('/api/users', data)
      .then(() => {
        toast.success('Account created successfully');
        setSuccess(true);
        // Reset the form after successful submission
        reset();
      })
      .catch((error) => {
        const errData = error.response.data as HttpErrorResponse;
        setErrors(errData);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  
  // Animation variants
  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <div ref={successMessageRef}>
        <SuccessFeedback
          show={success}
          message='Account created'
          description='An email verification code has been sent to your inbox. Please enter the code to verify your account. Check your spam folder if you do not find it!'
          action={
            <Link href={`/auth/verify-email/${submittedEmail}`} className='underline'>
              Verify Email
            </Link>
          }
          data-test='success-message'
        />
      </div>
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        {/* Form title */}
        <motion.div variants={itemVariants} className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {userRole === Role.CLIENT ? 'Join as a Client' : 'Join as a Freelancer'}
          </h1>
          <p className="mt-2 text-gray-600">
            {userRole === Role.CLIENT 
              ? 'Find the perfect talent for your projects' 
              : 'Discover projects that match your skills'}
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <SocialAuthLogins isLoading={isLoading} />
        </motion.div>
        
        <motion.form variants={itemVariants} onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <motion.div variants={itemVariants}>
                <FormInput
                  id='firstName'
                  label='First name'
                  type='text'
                  isLoading={isLoading}
                  register={register}
                  data-test='firstName-input'
                  className="bg-gray-50 focus:bg-white transition-colors"
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <FormInput
                  id='lastName'
                  label='Last name'
                  type='text'
                  isLoading={isLoading}
                  register={register}
                  data-test='lastName-input'
                  className="bg-gray-50 focus:bg-white transition-colors"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="sm:col-span-2">
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
                  className="bg-gray-50 focus:bg-white transition-colors"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="sm:col-span-2">
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
                  className="bg-gray-50 focus:bg-white transition-colors"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="sm:col-span-2">
                <FormInput
                  id='password'
                  label='Password'
                  type='password'
                  isLoading={isLoading}
                  register={register}
                  error={formState.errors.password?.message}
                  data-test='password-input'
                  className="bg-gray-50 focus:bg-white transition-colors"
                />
              </motion.div>

              {password?.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  className="sm:col-span-2 bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
                >
                  <PasswordStrengthBar password={password} />
                    <PasswordRequirements password={password} />
                  </motion.div>
              )}

              <motion.div variants={itemVariants} className="sm:col-span-2">
                <FormInput
                  id='passwordConfirmation'
                  label='Confirm password'
                  type='password'
                  isLoading={isLoading}
                  register={register}
                  error={formState.errors.passwordConfirmation?.message}
                  data-test='passwordConfirm-input'
                  className="bg-gray-50 focus:bg-white transition-colors"
                />
              </motion.div>
            </div>
          </div>

          <motion.div variants={itemVariants}>
            <ErrorFeedback data-test='error-message' data={errors} />
          </motion.div>

          <motion.div variants={itemVariants} className="pt-3">
            <Button
              className="w-full py-6 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
              disabled={isLoading}
              animation={'default'}
              type='submit'
              data-test='register-submit'
            >
              {isLoading
                ? 'Creating account...'
                : userRole === Role.CLIENT
                ? 'Register as a Client'
                : 'Register as a Freelancer'}
            </Button>
          </motion.div>
          
          <motion.div variants={itemVariants} className="text-center mt-5 text-gray-600 text-sm">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
}