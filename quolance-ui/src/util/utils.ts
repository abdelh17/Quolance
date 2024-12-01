import { Role } from '@/constants/models/user/UserResponse';
import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
