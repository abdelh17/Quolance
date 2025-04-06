'use client';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import * as z from 'zod';
import {toast} from 'sonner';
import {motion} from 'framer-motion';
import Link from 'next/link';
import {useEffect, useRef, useState} from 'react';

import {Button} from '@/components/ui/button';
import ErrorFeedback from '@/components/error-feedback';
import SuccessFeedback from '@/components/success-feedback';
import httpClient from '@/lib/httpClient';
import {HttpErrorResponse} from '@/models/http/HttpErrorResponse';
import AuthHeader from '@/app/(without-main-layout)/auth/register/components/AuthHeader';
import {FormInput} from "@/app/(without-main-layout)/auth/shared/auth-components";

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address')
});

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [submittedEmail, setSubmittedEmail] = useState<string>('');
    const [errors, setErrors] = useState<HttpErrorResponse | undefined>(undefined);

    const successMessageRef = useRef<HTMLDivElement>(null);

    const {register, handleSubmit, formState} = useForm<ForgotPasswordSchema>({
        resolver: zodResolver(forgotPasswordSchema),
        reValidateMode: 'onSubmit',
    });

    useEffect(() => {
        if (success && successMessageRef.current) {
            successMessageRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }, [success]);

    async function onSubmit(data: ForgotPasswordSchema) {
        setErrors(undefined);
        setSuccess(false);
        setIsLoading(true);

        httpClient
            .post(`/api/users/forgot-password/${encodeURIComponent(data.email)}`)
            .then(() => {
                setSubmittedEmail(data.email);
                setSuccess(true);
                toast.success('Password reset email sent');
            })
            .catch((error) => {
                const errData = error.response?.data as HttpErrorResponse;
                setErrors(errData);
                toast.error(errData?.message || 'Failed to send reset email');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    const formVariants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

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
        <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
            {/* Advanced Decorative Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Gradient Bubbles */}
                <div
                    className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-100 opacity-20 blur-3xl animate-blob"></div>
                <div
                    className="absolute top-60 -left-20 h-60 w-60 rounded-full bg-indigo-100 opacity-20 blur-3xl animate-blob animation-delay-2000"></div>

                {/* Sophisticated Circuit Pattern */}
                <svg width="100%" height="100%" className="absolute inset-0 text-gray-200/10 opacity-20"
                     style={{mixBlendMode: 'overlay'}}>
                    <defs>
                        <pattern id="sophisticated-circuit" x="0" y="0" width="100" height="100"
                                 patternUnits="userSpaceOnUse">
                            <path
                                d="M0 50 Q25 25, 50 50 T100 50
                                M50 0 Q75 25, 50 50 T50 100
                                M25 25 Q50 50, 75 25 T125 25"
                                stroke="currentColor"
                                strokeWidth="0.5"
                                fill="none"
                                strokeDasharray="5 5"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#sophisticated-circuit)"/>
                </svg>

                {/* Floating Geometric Elements */}
                <div
                    className="absolute top-1/4 left-1/4 w-16 h-16 bg-blue-200/30 rounded-full mix-blend-multiply animate-float"></div>
                <div
                    className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-indigo-200/30 rounded-full mix-blend-multiply animate-float animation-delay-4000"></div>
            </div>

            <div className="relative z-10">
                <AuthHeader userRole={undefined}/>

                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -20}}
                    transition={{duration: 0.3}}
                    className='mx-auto mt-4 flex h-full min-w-52 max-w-screen-sm flex-col justify-center space-y-6 px-4 pt-24 md:mt-0'
                >
                    <motion.h1
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.2, duration: 0.5}}
                        className='text-4xl font-bold tracking-tight text-gray-900
                        bg-clip-text text-transparent
                        bg-gradient-to-r from-blue-600 to-indigo-600
                        leading-tight'
                    >
                        Forgot Your Password?
                    </motion.h1>
                    <motion.p
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.3, duration: 0.5}}
                        className='text-lg text-gray-600'
                    >
                        Don't worry, we'll send you a reset link
                    </motion.p>

                    <div className="grid gap-6">
                        <div ref={successMessageRef}>
                            <SuccessFeedback
                                show={success}
                                message='Reset email sent'
                                description={`We've sent a password reset link to ${submittedEmail}. Please check your inbox and follow the instructions.`}
                                action={
                                    <Link href="/auth/login"
                                          className='font-medium text-blue-600 hover:text-blue-500 underline'>
                                        Back to Login
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
                            {!success && (
                                <motion.form variants={itemVariants} onSubmit={handleSubmit(onSubmit)}
                                             className="space-y-5">
                                    <div className="space-y-5">
                                        <motion.div variants={itemVariants} className="sm:col-span-2">
                                            <FormInput
                                                id='email'
                                                label='Email address'
                                                type='email'
                                                isLoading={isLoading}
                                                register={register}
                                                error={formState.errors.email?.message}
                                                data-test='email-input'
                                                className="bg-gray-50 focus:bg-white transition-colors"
                                                placeholder="Enter your email address"
                                            />
                                        </motion.div>
                                    </div>

                                    <motion.div variants={itemVariants}>
                                        <ErrorFeedback data-test='error-message' data={errors}/>
                                    </motion.div>

                                    <motion.div variants={itemVariants} className="pt-3">
                                        <Button
                                            className="w-full py-6 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                                            disabled={isLoading}
                                            animation={'default'}
                                            type='submit'
                                            data-test='submit-button'
                                        >
                                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                                        </Button>
                                    </motion.div>

                                    <motion.div variants={itemVariants}
                                                className="text-center mt-5 text-gray-600 text-sm">
                                        Remembered your password?{' '}
                                        <Link href="/auth/login"
                                              className="font-medium text-blue-600 hover:text-blue-500">
                                            Sign in
                                        </Link>
                                    </motion.div>
                                </motion.form>
                            )}
                        </motion.div>
                    </div>

                    <div className="flex flex-col items-center space-y-4 pb-4">
                        <p className='text-center text-sm text-gray-500 max-w-md'>
                            By requesting a password reset, you agree to our{' '}
                            <Link
                                href='/support/terms-of-service'
                                className='text-blue-600 hover:text-blue-800 underline'
                            >
                                Terms
                            </Link>{' '}
                            and{' '}
                            <Link
                                href='/support/privacy-policy'
                                className='text-blue-600 hover:text-blue-800 underline'
                            >
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Custom Tailwind animations */}
            <style jsx global>{`
                @keyframes blob {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    50% {
                        transform: translate(50px, 50px) scale(1.2);
                    }
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }

                .animate-blob {
                    animation: blob 15s infinite;
                }

                .animate-float {
                    animation: float 10s infinite;
                }

                .animation-delay-2000 {
                    animation-delay: 2s;
                }

                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
}