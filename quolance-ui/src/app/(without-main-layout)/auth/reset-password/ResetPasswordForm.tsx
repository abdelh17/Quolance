'use client';
import {zodResolver} from '@hookform/resolvers/zod';
import {useRouter} from 'next/navigation';
import React, {useEffect, useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import * as z from 'zod';
import {toast} from 'sonner';
import {motion} from 'framer-motion';
import Link from 'next/link';

import {Button} from '@/components/ui/button';
import ErrorFeedback from '@/components/error-feedback';
import SuccessFeedback from '@/components/success-feedback';
import httpClient from '@/lib/httpClient';
import {HttpErrorResponse} from '@/models/http/HttpErrorResponse';
import {cn} from '@/util/utils';
import PasswordStrengthBar from '@/app/(with-main-layout)/(authenticated-pages)/setting/components/PasswordStrengthBar';
import PasswordRequirements from '@/app/(without-main-layout)/auth/register/components/PasswordRequirement';
import {FormInput} from "@/app/(without-main-layout)/auth/shared/auth-components";

const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters long')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number')
            .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
        confirmPassword: z.string().min(8),
        passwordResetToken: z.string().min(1, 'Reset token is required'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps extends React.HTMLAttributes<HTMLDivElement> {
    email: string;
}

export function ResetPasswordForm({ email, className, ...props }: ResetPasswordFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [errors, setErrors] = useState<HttpErrorResponse | undefined>(undefined);

    // Reference for the success message element
    const successMessageRef = useRef<HTMLDivElement>(null);

    const { register, handleSubmit, formState, watch, reset } = useForm<ResetPasswordSchema>({
        resolver: zodResolver(resetPasswordSchema),
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

    async function onSubmit(data: ResetPasswordSchema) {
        setErrors(undefined);
        setSuccess(false);
        setIsLoading(true);

        httpClient
            .patch(`/api/users/reset-forgotten-password/${email}`, data)
            .then(() => {
                toast.success('Password has been reset successfully');
                setSuccess(true);
                // Reset the form after successful submission
                reset();
                // Redirect to login after a short delay
                setTimeout(() => {
                    router.push('/auth/login');
                }, 2000);
            })
            .catch((error) => {
                const errData = error.response?.data as HttpErrorResponse;
                setErrors(errData);
                toast.error(errData?.message || 'Failed to reset password');
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
                    message='Password reset complete'
                    description='Your password has been successfully reset. You will be redirected to login shortly.'
                    action={
                        <Link href="/auth/login" className='font-medium text-blue-600 hover:text-blue-500 underline'>
                            Go to Login
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
                    {/*<h1 className="text-2xl font-bold text-gray-900">*/}
                    {/*    Get back access to Quolance*/}
                    {/*</h1>*/}
                    <p className="mt-2 text-gray-600">
                        Enter your new password and the reset token sent to {email}
                    </p>
                </motion.div>

                <motion.form variants={itemVariants} onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                            <motion.div variants={itemVariants} className="sm:col-span-2">
                                <FormInput
                                    id='passwordResetToken'
                                    label='Reset Token'
                                    type='text'
                                    isLoading={isLoading}
                                    register={register}
                                    data-test='passwordResetToken-input'
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

                            {/*{password?.length > 0 && (*/}
                            {/*    <motion.div*/}
                            {/*        variants={itemVariants}*/}
                            {/*        className="sm:col-span-2 bg-white p-3 rounded-lg border border-gray-100"*/}
                            {/*    >*/}
                            {/*        <PasswordStrengthBar password={password} />*/}
                            {/*        <div className="mt-3">*/}
                            {/*            <PasswordRequirements password={password} />*/}
                            {/*        </div>*/}
                            {/*    </motion.div>*/}
                            {/*)}*/}

                            <motion.div variants={itemVariants} className="sm:col-span-2">
                                <FormInput
                                    id='confirmPassword'
                                    label='Confirm password'
                                    type='password'
                                    isLoading={isLoading}
                                    register={register}
                                    error={formState.errors.confirmPassword?.message}
                                    data-test='confirmPassword-input'
                                    className="bg-gray-50 focus:bg-white transition-colors"
                                />
                            </motion.div>
                        </div>

                    </div>

                    <motion.div variants={itemVariants}>
                        <ErrorFeedback data-test='error-message' data={errors} />
                    </motion.div>
                    {errors?.message === 'Password reset code is expired. Please request a new one.' && (
                        <motion.div variants={itemVariants} className="text-sm text-gray-600">
                            Didn’t get the code?{' '}
                            <Link
                                href="/auth/forgot-password"
                                className="font-medium text-blue-600 hover:text-blue-500 underline"
                            >
                                Request a new one
                            </Link>
                        </motion.div>
                    )}

                    <motion.div variants={itemVariants} className="pt-3">
                        <Button
                            className="w-full py-6 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                            disabled={isLoading}
                            animation={'default'}
                            type='submit'
                            data-test='reset-submit'
                        >
                            {isLoading ? 'Resetting Password...' : 'Reset Password'}
                        </Button>
                    </motion.div>

                    <motion.div variants={itemVariants} className="text-center mt-5 text-gray-600 text-sm">
                        Remembered your password?{' '}
                        <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Sign in
                        </Link>
                    </motion.div>
                </motion.form>

            </motion.div>
        </div>
    );
}