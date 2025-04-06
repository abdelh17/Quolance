'use client';
import Link from 'next/link';
import {useEffect, useRef, useState} from 'react';
import {toast} from 'sonner';
import {useParams} from 'next/navigation';
import {motion} from 'framer-motion';
import {VerificationForm} from '../components/verification-code';
import AuthHeader from '@/app/(without-main-layout)/auth/register/components/AuthHeader';
import httpClient from '@/lib/httpClient';
import SuccessFeedback from '@/components/success-feedback';
import ErrorFeedback from '@/components/error-feedback';
import {HttpErrorResponse} from '@/models/http/HttpErrorResponse';
import {Button} from '@/components/ui/button';

export default function VerificationPage() {
    const params = useParams();
    const email = typeof params.email === 'string' ? params.email : '';

    const decodedEmail = decodeURIComponent(email);

    const [isResending, setIsResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [resendError, setResendError] = useState<HttpErrorResponse | null>(null);

    // Reference for the success message element
    const successMessageRef = useRef<HTMLDivElement>(null);

    // Scroll to success message when it appears
    useEffect(() => {
        if (resendSuccess && successMessageRef.current) {
            successMessageRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }, [resendSuccess]);

    const handleResendCode = async () => {
        if (!email) {
            toast.error('Email parameter is missing from URL');
            return;
        }

        setIsResending(true);
        setResendSuccess(false);
        setResendError(null);

        try {
            await httpClient.post(`/api/auth/resend-verification/${decodedEmail}`);

            setResendSuccess(true);
            toast.success('Verification code has been resent to your email');
        } catch (error: any) {
            if (error.response) {
                if (error.response.data && error.response.data.message === 'Email already verified') {
                    setResendError({
                        message: 'Email already verified. You can proceed to login.',
                        status: error.response.status
                    });
                    toast.error('Email already verified');
                } else {
                    setResendError({
                        message: error.response.data?.message || 'Failed to resend verification code',
                        status: error.response.status
                    });
                    toast.error('Failed to resend verification code');
                }
            } else {
                setResendError({
                    message: 'Network error. Please try again later.',
                    status: 0
                });
                toast.error('Network error. Please try again later.');
            }
        } finally {
            setIsResending(false);
        }
    };

    useEffect(() => {
        if (!email) {
            toast.error('No email provided in URL');
        }
    }, [email]);

    // Animation variants
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
                        Verify Your Email
                    </motion.h1>
                    <motion.p
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.3, duration: 0.5}}
                        className='text-lg text-gray-600'
                    >
                        Enter the verification code we sent to your email
                    </motion.p>

                    <div className="grid gap-6">
                        <div ref={successMessageRef}>
                            <SuccessFeedback
                                show={resendSuccess}
                                message='Verification code sent!'
                                description={`We've sent a new verification code to ${decodedEmail}. Please enter it below.`}
                                data-test='resend-success-message'
                            />
                        </div>

                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={formVariants}
                        >
                            {resendError && (
                                <motion.div variants={itemVariants} className="mb-4">
                                    <ErrorFeedback
                                        data={{
                                            message: resendError.message,
                                            status: resendError.status
                                        }}
                                        data-test="resend-error-message"
                                    />
                                </motion.div>
                            )}

                            <motion.div variants={itemVariants}>
                                <VerificationForm email={email} />
                            </motion.div>

                            <motion.div variants={itemVariants} className="pt-6">
                                <p className="text-center text-gray-600 mb-4">
                                    Haven't received the code?
                                </p>
                                <Button
                                    className="w-full py-6 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                                    disabled={isResending || !email}
                                    animation={'default'}
                                    onClick={handleResendCode}
                                    data-test="resend-button"
                                >
                                    {isResending ? 'Resending...' : 'Resend Verification Code'}
                                </Button>
                            </motion.div>

                            <motion.div variants={itemVariants} className="text-center mt-5 text-gray-600 text-sm">
                                Already verified?{' '}
                                <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                                    Sign in
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>

                    <div className="flex flex-col items-center space-y-4 pb-4">
                        <p className='text-center text-sm text-gray-500 max-w-md'>
                            By verifying your email, you agree to our{' '}
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