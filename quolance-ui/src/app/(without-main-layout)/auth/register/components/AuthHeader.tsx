import React from 'react';
import { RegistrationUserType } from '@/app/(without-main-layout)/auth/register/page';
import Link from 'next/link';
import { Role } from '@/constants/models/user/UserResponse';

const getPropsFromUserRole = (userRole: RegistrationUserType) => {
  switch (userRole) {
    case Role.CLIENT:
      return {
        title: 'Here to hire talent?',
        linkText: 'Join as a freelancer',
      };
    case Role.FREELANCER:
      return {
        title: 'Here to hire talent?',
        linkText: 'Join as a client',
      };
    default:
      return {
        title: '',
        linkText: '',
      };
  }
};
type AuthHeaderProps = {
  userRole?: RegistrationUserType; // Make it optional
  setUserRole?: (role: RegistrationUserType) => void;
};

function AuthHeader({ userRole, setUserRole }: AuthHeaderProps) {
  const { title, linkText } = getPropsFromUserRole(userRole ?? undefined); // Add null coalescing

  const setNewRole = () => {
    if (setUserRole && userRole) {
      // Add userRole check
      setUserRole(userRole === Role.CLIENT ? Role.FREELANCER : Role.CLIENT);
    }
  };

  return (
    <div
      className={'mx-auto flex max-w-[1600px] items-center justify-between p-4'}
    >
      <Link href='/' className={'outline-none'}>
        <h1 className='text-2xl font-bold'>Quolance</h1>
      </Link>
      {userRole && ( // Only show this section if userRole exists
        <div className={'text-md invisible flex gap-5 font-medium sm:visible'}>
          <span className={'text-n700'}>{title}</span>
          <button
            onClick={setNewRole}
            className='hover:text-n600 border-none bg-transparent p-0 font-medium underline underline-offset-4'
            type='button'
          >
            {linkText}
          </button>
        </div>
      )}
    </div>
  );
}

export default AuthHeader;
