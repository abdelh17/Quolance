'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { UserRegisterForm } from './components/register-form';
import AuthHeader from '@/app/(without-main-layout)/auth/register/components/AuthHeader';
import { Role } from '@/constants/models/user/UserResponse';
import RadioCardUser from '@/app/(without-main-layout)/auth/register/components/RadioCardUser';
import { Briefcase, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type RegistrationUserType = Role.CLIENT | Role.FREELANCER | undefined;

export default function RegisterPage() {
  const [userRole, setUserRole] = useState<RegistrationUserType>(undefined);
  const [userRoleConfirmed, setUserRoleConfirmed] = useState<boolean>(false);

  return (
    <div>
      <AuthHeader
        userRole={userRoleConfirmed ? userRole : undefined}
        setUserRole={setUserRole}
      />

      {!userRoleConfirmed ? (
        <UserRoleSelection
          setUserRole={setUserRole}
          setUserRoleConfirmed={setUserRoleConfirmed}
        />
      ) : (
        <UserRegistration userRole={userRole} />
      )}
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
    <div className='mx-auto max-w-3xl px-4 pt-16'>
      <h1 className='text-n700 mb-10 text-center text-2xl font-semibold'>
        Join as a client or freelancer
      </h1>
      <div className='grid gap-7 md:grid-cols-2'>
        <RadioCardUser
          icon={User}
          text="I'm a client, hiring for a project"
          isSelected={selected === Role.CLIENT}
          onSelect={() => handleSelect(Role.CLIENT)}
        />
        <RadioCardUser
          icon={Briefcase}
          text="I'm a freelancer, looking for work"
          isSelected={selected === Role.FREELANCER}
          onSelect={() => handleSelect(Role.FREELANCER)}
        />
      </div>
      <div className={'flex w-full justify-center'}>
        <Button
          className='mt-10 px-7 py-[22px]'
          onClick={() => setUserRoleConfirmed(true)}
          disabled={!selected}
          bgColor={'n900'}
          animation={{
            hoverTextColor: 'text-n700',
            overlayColor: 'bg-yellow-400',
          }}
        >
          {!selected
            ? 'Create an account'
            : selected === Role.CLIENT
            ? 'Join as a client'
            : 'Apply as a freelancer'}
        </Button>
      </div>
      <div className={'mt-6 flex w-full flex-row justify-center'}>
        <span>Already have an account?</span>
        <Link
          href={'/auth/login'}
          className={'hover:text-n600 ml-1 underline underline-offset-4'}
        >
          Login
        </Link>
      </div>
    </div>
  );
};

const UserRegistration = ({ userRole }: { userRole: RegistrationUserType }) => {
  return (
    <div className='mx-auto mt-4 flex h-full min-w-52 max-w-screen-sm flex-col justify-center space-y-6 px-4 pt-24 md:mt-0'>
      <h1 className='text-2xl font-semibold'>
        {userRole === Role.CLIENT
          ? 'Sign up to find the best talent'
          : 'Sign up to work on projects'}
      </h1>
      <UserRegisterForm userRole={userRole} />
      <p className='text-center'>
        Already have an account?
        <Link
          href='/auth/login'
          className='hover:text-n600 ml-1 underline underline-offset-4'
        >
          Login
        </Link>
      </p>
      <p className='text-center text-sm'>
        By creating an account, you agree to our{' '}
        <Link
          href='/terms'
          className='hover:text-n600 underline underline-offset-4'
        >
          Terms
        </Link>{' '}
        and{' '}
        <Link
          href='/privacy'
          className='hover:text-n600 underline underline-offset-4'
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
};
