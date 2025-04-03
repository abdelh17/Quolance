'use client';
import Link from 'next/link';
import React, {useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {UserRegisterForm} from './components/register-form';
import AuthHeader from '@/app/(without-main-layout)/auth/register/components/AuthHeader';
import {Role} from '@/models/user/UserResponse';
import RadioCardUser from '@/app/(without-main-layout)/auth/register/components/RadioCardUser';
import {Briefcase, User} from 'lucide-react';
import {Button} from '@/components/ui/button';

export type RegistrationUserType = Role.CLIENT | Role.FREELANCER | undefined;

export default function RegisterPage() {
  const [userRole, setUserRole] = useState<RegistrationUserType>(undefined);
  const [userRoleConfirmed, setUserRoleConfirmed] = useState<boolean>(false);

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
        <AuthHeader
          userRole={userRoleConfirmed ? userRole : undefined}
          setUserRole={setUserRole}
        />

        <AnimatePresence mode="wait">
          {!userRoleConfirmed ? (
            <UserRoleSelection
              key="role-selection"
              setUserRole={setUserRole}
              setUserRoleConfirmed={setUserRoleConfirmed}
            />
          ) : (
            <UserRegistration
              key="user-registration"
              userRole={userRole}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const UserRoleSelection = ({
  setUserRole,
  setUserRoleConfirmed,
}: {
  setUserRole: (role: RegistrationUserType) => void;
  setUserRoleConfirmed: (value: boolean) => void;
}) => {
  const [selected, setSelected] = useState<Role | undefined>(undefined);

  const handleSelect = (role: RegistrationUserType) => {
    setSelected(role);
    setUserRole(role);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className='mx-auto max-w-4xl px-4 pt-16'
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className='text-center mb-12'
      >
        <div className="inline-flex items-center bg-blue-100/50 px-4 py-2 rounded-full mb-4 shadow-sm">
          <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
          <span className="text-sm font-medium text-blue-800">
            Create Your Account
          </span>
        </div>
        <h1 className='text-4xl font-bold tracking-tight text-gray-900 mb-4'>
          Join as a <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600'>Professional</span>
        </h1>
        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
          Choose your role to get started. Whether you're looking to hire top talent or find exciting projects, we've got you covered.
        </p>
      </motion.div>

      <div className='grid gap-8 md:grid-cols-2'>
        {[
          {
            role: Role.CLIENT,
            icon: User,
            text: "I'm a client, hiring for a project",
            color: "blue",
            delay: 0.1
          },
          {
            role: Role.FREELANCER,
            icon: Briefcase,
            text: "I'm a freelancer, looking for work",
            color: "indigo",
            delay: 0.2
          }
        ].map((item) => (
          <motion.div
            key={item.role}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: item.delay, duration: 0.5 }}
          >
            <RadioCardUser
              icon={item.icon}
              text={item.text}
              isSelected={selected === item.role}
              onSelect={() => handleSelect(item.role as RegistrationUserType)}
              data-test={item.role === Role.CLIENT ? 'client-role' : 'freelancer-role'}
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className={'flex w-full justify-center mt-10'}
      >
        <Button
          className='px-10 py-3 text-base font-semibold
            bg-gradient-to-r from-blue-600 to-indigo-600
            hover:from-blue-700 hover:to-indigo-700
            shadow-lg hover:shadow-xl
            transition-all duration-300
            transform hover:-translate-y-1'
          onClick={() => setUserRoleConfirmed(true)}
          disabled={!selected}
          animation={'default'}
          data-test='select-role'
        >
          {!selected
            ? 'Create an account'
            : selected === Role.CLIENT
            ? 'Join as a client'
            : 'Join as a freelancer'}
        </Button>
      </motion.div>
    </motion.div>
  );
};

const UserRegistration = ({ userRole }: { userRole: RegistrationUserType }) => {
  return (
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
        {userRole === Role.CLIENT
          ? 'Find Your Perfect Talent'
          : 'Showcase Your Skills'}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className='text-lg text-gray-600'
      >
        {userRole === Role.CLIENT
          ? 'Connect with top-tier freelancers who can bring your project to life.'
          : 'Build your portfolio and connect with exciting projects.'}
      </motion.p>

      <UserRegisterForm userRole={userRole} />

      <div className="flex flex-col items-center space-y-4">
        <p className='text-center text-sm text-gray-500 max-w-md'>
          By creating an account, you agree to our{' '}
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
  );
};

// Custom Tailwind animations
const styles = `
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
`;