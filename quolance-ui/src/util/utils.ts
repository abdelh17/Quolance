import { Role } from '@/models/user/UserResponse';
import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import config from '../../tailwind.config';
import { Config } from 'tailwindcss';

export const getUserRoleForAPI = (role: Role | undefined) => {
  if (role === Role.CLIENT) {
    return 'client';
  } else if (role === Role.FREELANCER) {
    return 'freelancer';
  } else {
    return 'public';
  }
};

/** Merge classes with tailwind-merge with clsx full feature */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isMobileWidth = (windowWidth: number) => {
  const smBreakpoint =
    ((config as Config).theme?.extend?.screens as Record<string, string>).sm ||
    '576px';
  return windowWidth < parseInt(smBreakpoint);
};
