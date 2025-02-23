'use client';

import Link from 'next/link';
import {VerificationForm} from './components/verification-code';
import AuthHeader from '@/app/(without-main-layout)/auth/register/components/AuthHeader';

export default function VerificationPage() {
    return (
        <>
            <AuthHeader userRole={undefined}/>
            <div
                className="mx-auto mt-4 flex h-full min-w-52 max-w-screen-sm flex-col justify-center space-y-6 pt-24 md:mt-0">
                <div className="rounded-3xl border p-6">
                    <div className="my-6 flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Verify Your Email
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Enter your email and the verification code we sent you
                        </p>
                    </div>

                    <VerificationForm/>

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
                        <Link
                            href="/auth/resend-verification"
                            className="rounded-lg border px-8 py-2 text-center transition-colors hover:bg-gray-50"
                        >
                            Resend verification code
                        </Link>
                    </p>
                </div>

                <p className="flex justify-center gap-x-2">
                    Already verified?{' '}
                    <Link
                        href="/auth/login"
                        className="underline underline-offset-4"
                    >
                        Sign in
                    </Link>
                </p>

            </div>
        </>
    );
}