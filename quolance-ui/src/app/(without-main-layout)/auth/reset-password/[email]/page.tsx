'use client';
import {useParams} from 'next/navigation';
import {ResetPasswordForm} from '../ResetPasswordForm';
import AuthHeader from '@/app/(without-main-layout)/auth/register/components/AuthHeader';
import {toast} from 'sonner';
import {motion} from 'framer-motion';
import {useEffect} from 'react';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const params = useParams();
    const email = typeof params.email === 'string' ? decodeURIComponent(params.email) : '';

    useEffect(() => {
        if (!email) {
            toast.error('Missing email in URL');
        }
    }, [email]);

    if (!email) {
        return (
            <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-md">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Reset Link</h1>
                    <p className="text-gray-600 mb-6">
                        The password reset link you used is invalid or has expired.
                    </p>
                    <Link
                        href="/auth/forgot-password"
                        className="inline-block px-6 py-3 rounded bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium"
                    >
                        Request New Reset Link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
            {/* Advanced Decorative Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Gradient Bubbles */}
                <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-100 opacity-20 blur-3xl animate-blob"></div>
                <div className="absolute top-60 -left-20 h-60 w-60 rounded-full bg-indigo-100 opacity-20 blur-3xl animate-blob animation-delay-2000"></div>

                {/* Sophisticated Circuit Pattern */}
                <svg width="100%" height="100%" className="absolute inset-0 text-gray-200/10 opacity-20" style={{ mixBlendMode: 'overlay' }}>
                    <defs>
                        <pattern id="sophisticated-circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
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
                    <rect width="100%" height="100%" fill="url(#sophisticated-circuit)" />
                </svg>

                {/* Floating Geometric Elements */}
                <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-blue-200/30 rounded-full mix-blend-multiply animate-float"></div>
                <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-indigo-200/30 rounded-full mix-blend-multiply animate-float animation-delay-4000"></div>
            </div>

            <div className="relative z-10">
                <AuthHeader userRole={undefined} />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className='mx-auto mt-4 flex h-full min-w-52 max-w-screen-sm flex-col justify-center space-y-6 px-4 pt-24 md:mt-0'
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className='text-4xl font-bold tracking-tight text-gray-900
          bg-clip-text text-transparent
          bg-gradient-to-r from-blue-600 to-indigo-600
          leading-tight'
                    >
                        Reset Your Password
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className='text-lg text-gray-600'
                    >
                        Create a new secure password for your account
                    </motion.p>


                        <ResetPasswordForm email={email} />

                    <div className="flex flex-col items-center space-y-4 pb-4">
                        <p className='text-center text-sm text-gray-500 max-w-md'>
                            By resetting your password, you agree to our{' '}
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
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(50px, 50px) scale(1.2); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
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