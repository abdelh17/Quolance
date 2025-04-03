'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

import {UserAuthForm} from './components/user-auth-form';
import AuthHeader from '@/app/(without-main-layout)/auth/register/components/AuthHeader';
import * as React from 'react';

export default function LoginPage() {
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
          transition={{ duration: 0.5 }}
          className='mx-auto mt-4 flex h-full min-w-52 max-w-screen-sm flex-col justify-center space-y-6 pb-6 pt-24 md:mt-0 px-4'
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className='rounded-2xl border border-gray-100 bg-white shadow-xl p-8 sm:p-10'
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className='my-6 flex flex-col space-y-4 text-center'
            >
              <h1 className='text-3xl font-bold tracking-tight text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600'>
                Login to your account
              </h1>
              <p className='text-gray-600 text-base'>
                Enter your email and password below to access your account
              </p>
            </motion.div>

            <UserAuthForm />

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className='relative my-10'
            >
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t border-gray-200' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='text-gray-500 bg-white px-2'>
                  Don't have a Quolance account?
                </span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className='flex justify-center'
            >
              <Link
                href='/auth/register'
                className='w-full text-center px-8 py-3 rounded-lg 
                  bg-gradient-to-r from-blue-50 to-indigo-50 
                  text-blue-700 font-semibold 
                  border border-gray-100 
                  hover:from-blue-100 hover:to-indigo-100 
                  transition-all duration-300 
                  shadow-sm hover:shadow-md'
              >
                Register now
              </Link>
            </motion.div>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className='text-gray-500 !mt-4 px-8 text-center text-sm'
          >
            By clicking continue, you agree to our{' '}
            <Link
              href='/support/terms-of-service'
              className='text-blue-600 hover:text-blue-800 underline underline-offset-4'
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href='/support/privacy-policy'
              className='text-blue-600 hover:text-blue-800 underline underline-offset-4'
            >
              Privacy Policy
            </Link>
            .
          </motion.p>
        </motion.div>
      </div>

      {/* Custom Tailwind animations */}
      <style jsx>{`
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