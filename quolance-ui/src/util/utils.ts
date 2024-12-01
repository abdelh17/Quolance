import { Role } from '@/constants/models/user/UserResponse';

export const getUserRoleForAPI = (role: Role | undefined) => {
  if (role === Role.CLIENT) {
    return 'client';
  } else if (role === Role.FREELANCER) {
    return 'freelancer';
  } else {
    return 'public';
  }
};
