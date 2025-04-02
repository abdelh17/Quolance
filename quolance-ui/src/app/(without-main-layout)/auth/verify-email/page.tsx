'use client';
import Link from 'next/link';
import {SetStateAction, useEffect, useState} from 'react';
import {toast} from 'sonner';
import {VerificationForm} from './components/verification-code';
import AuthHeader from '@/app/(without-main-layout)/auth/register/components/AuthHeader';
import httpClient from '@/lib/httpClient';
import SuccessFeedback from '@/components/success-feedback';
import ErrorFeedback from '@/components/error-feedback';
import {HttpErrorResponse} from '@/models/http/HttpErrorResponse';

export default function VerificationPage() {
    const [email, setEmail] = useState('');
    const [isResending, setIsResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [resendError, setResendError] = useState<HttpErrorResponse | null>(null);

    const handleResendCode = async () => {
        if (!email) {
            toast.error('Please enter your email in the form first');
            return;
        }

        setIsResending(true);
        setResendSuccess(false);
        setResendError(null);

        try {
            const response = await httpClient.post(`/api/auth/resend-verification/${email}`);

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


    const updateEmail = (value: SetStateAction<string>) => {
        setEmail(value);
    };


    useEffect(() => {
        if (resendError) {
            setResendError(null);
        }
    }, [email]);

    return (
        <>
            <AuthHeader userRole={undefined}/>
            <div className="mx-auto mt-4 flex h-full min-w-52 max-w-screen-sm flex-col justify-center space-y-6 pt-24 md:mt-0">
                <div className="rounded-3xl border p-6">


                    <div className="my-6 flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Verify Your Email
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Enter your email and the verification code we sent you
                        </p>
                    </div>
                    {resendSuccess && (
                        <div className="mb-4">
                            <SuccessFeedback
                                show={true}
                                message="Verification code sent!"
                                description="A new verification code has been sent to your email. Please enter it below."
                                data-test="resend-success-message"
                            />
                        </div>
                    )}
                    {resendError && (
                        <div className="mb-4">
                            <ErrorFeedback
                                data={{
                                    message: resendError.message,
                                    status: resendError.status
                                }}
                                data-test="resend-error-message"
                            />
                        </div>
                    )}
                    <VerificationForm onEmailChange={updateEmail}/>
                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t"/>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
              <span className="text-muted-foreground bg-white px-2">
                Haven't received the code?
              </span>
                        </div>
                    </div>

                    <p className="flex justify-center gap-x-2 pb-4">
                        <button
                            onClick={handleResendCode}
                            disabled={isResending || !email}
                            className="rounded-lg border px-8 py-2 text-center transition-colors hover:bg-gray-50 disabled:opacity-50"
                            data-test="resend-button"
                        >
                            {isResending ? 'Resending...' : 'Resend verification code'}
                        </button>
                    </p>
                </div>

                <p className="flex justify-center gap-x-2">
                    Already verified?{' '}
                    <Link href="/auth/login" className="underline underline-offset-4">
                        Sign in
                    </Link>
                </p>

            </div>
        </>
    );
}