'use client';
import {zodResolver} from '@hookform/resolvers/zod';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import * as React from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import {motion} from 'framer-motion';
import * as z from 'zod';

import httpClient from '@/lib/httpClient';
import ErrorFeedback from '@/components/error-feedback';
import SuccessFeedback from '@/components/success-feedback';
import {Button} from '@/components/ui/button';
import {HttpErrorResponse} from '@/models/http/HttpErrorResponse';

const CODE_LENGTH = 6;

const verificationFormSchema = z.object({
  verificationCode: z
      .string()
      .length(CODE_LENGTH, `Verification code must be ${CODE_LENGTH} characters`)
});

type VerificationSchema = z.infer<typeof verificationFormSchema>;

interface VerificationFormProps extends React.HTMLAttributes<HTMLDivElement> {
  email: string;
}

export function VerificationForm({
                                   className,
                                   email,
                                   ...props
                                 }: VerificationFormProps) {
  const router = useRouter();
  const [success, setSuccess] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<HttpErrorResponse | undefined>(undefined);
  const [countdown, setCountdown] = React.useState(3);
  const [redirecting, setRedirecting] = React.useState(false);
  const [code, setCode] = React.useState(Array(CODE_LENGTH).fill(''));

  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const decodedEmail = React.useMemo(() => {
    try {
      return decodeURIComponent(email);
    } catch (e) {
      return email;
    }
  }, [email]);

  const { handleSubmit, setError, formState, setValue, clearErrors } = useForm<VerificationSchema>({
    resolver: zodResolver(verificationFormSchema),
    reValidateMode: 'onSubmit',
    defaultValues: {
      verificationCode: ''
    }
  });

  React.useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, CODE_LENGTH);
  }, []);

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

  const handleInputChange = (index: number, value: string) => {
    if (value && !/^\d*$/.test(value)) {
      return;
    }

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    const combinedCode = newCode.join('');
    setValue('verificationCode', combinedCode);

    if (combinedCode.length === CODE_LENGTH) {
      clearErrors('verificationCode');
    }

    if (value && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();

    if (!/^\d*$/.test(pastedData)) {
      return;
    }

    const chars = pastedData.slice(0, CODE_LENGTH).split('');

    const newCode = [...code];
    chars.forEach((char, idx) => {
      if (idx < CODE_LENGTH) {
        newCode[idx] = char;
      }
    });

    setCode(newCode);
    setValue('verificationCode', newCode.join(''));

    if (chars.length < CODE_LENGTH) {
      inputRefs.current[chars.length]?.focus();
    } else {
      inputRefs.current[CODE_LENGTH - 1]?.focus();
    }
  };

  async function onSubmit(data: VerificationSchema) {
    setErrors(undefined);
    setIsLoading(true);

    const verificationData = {
      verificationCode: data.verificationCode
    };

    httpClient
        .post(`/api/auth/verify-email/${email}`, verificationData)
        .then((response) => {
          setSuccess(true);
          setRedirecting(true);
          toast.success('Email verified successfully');
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
        })
        .finally(() => {
          setIsLoading(false);
        });
  }

  // Animation item variants
  const itemVariants = {
    hidden: {opacity: 0, y: 10},
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
      <div className={className} {...props}>
        <SuccessFeedback
            show={success}
            message='Account verified successfully'
            description='You can now login with your email and password.'
            action={
              <Link href='/auth/login' className='font-medium text-blue-600 hover:text-blue-500 underline'>
                Login
              </Link>
            }
            data-test='success-message'
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-4'>
            <motion.div variants={itemVariants}>
              <div className="flex justify-center space-x-2 mb-4" onPaste={handlePaste}>
                {Array.from({ length: CODE_LENGTH }).map((_, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={code[index]}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-12 text-center text-lg font-semibold bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                        disabled={isLoading}
                        aria-label={`Digit ${index + 1} of verification code`}
                        data-test={`verification-code-digit-${index}`}
                    />
                ))}
              </div>
              {formState.errors.verificationCode && (
                  <p className="text-sm text-red-500 mt-1 text-center">
                    {formState.errors.verificationCode.message}
                  </p>
              )}
              <p className="text-sm text-gray-600 mt-2 text-center">
                Enter the {CODE_LENGTH}-digit code sent to<br/>
                <span className="font-semibold">{decodedEmail}</span>
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <ErrorFeedback data-test='error-message' data={errors} />
            </motion.div>

            <motion.div variants={itemVariants} className="pt-3">
              <Button
                  disabled={isLoading || code.join('').length !== CODE_LENGTH}
                  type='submit'
                  className="w-full py-6 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  data-test='verify-submit'
              >
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </Button>
            </motion.div>
          </div>
        </form>

        {(redirecting || success) && (
            <motion.div
                variants={itemVariants}
                className='mt-4 text-sm text-center text-gray-600'
            >
              You will be redirected to the login page in {countdown}...
            </motion.div>
        )}
      </div>
  );
}