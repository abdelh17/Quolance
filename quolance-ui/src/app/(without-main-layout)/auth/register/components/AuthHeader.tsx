import React from 'react';
import { RegistrationUserType } from '@/app/(without-main-layout)/auth/register/page';
import Link from 'next/link';
import { Role } from '@/constants/models/user/UserResponse';

type AuthHeaderProps = {
  userRole: RegistrationUserType;
  setUserRole?: (role: RegistrationUserType) => void;
};

const getPropsFromUserRole = (userRole: RegistrationUserType) => {
  switch (userRole) {
    case Role.CLIENT:
      return {
        title: 'Here to hire talent?',
        linkText: 'Apply as a freelancer',
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

function AuthHeader({ userRole, setUserRole }: AuthHeaderProps) {
  const { title, linkText } = getPropsFromUserRole(userRole);

  const setNewRole = () => {
    if (setUserRole) {
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
      <div className={'text-md invisible flex gap-5 font-medium sm:visible'}>
        <span className={'text-n700'}>{title}</span>
        <div
          onClick={setNewRole}
          className={
            'hover:text-n600 cursor-pointer font-medium underline  underline-offset-4'
          }
        >
          {linkText}
        </div>
      </div>
    </div>
  );
}

export default AuthHeader;
