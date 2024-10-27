'use client';
import { useQuery } from '@tanstack/react-query';
import { Users } from '@/data/data';
import { UserType } from '@/types/userTypes';

/*--- Hooks ---*/
export const useGetUserProfile = (userId = '1') => {
  return useQuery({
    queryKey: ['userRole'],
    queryFn: () => fetchUserType(userId),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

/*--- Fetching functions ---*/
// Hardcoded for now
const fetchUserType = async (userId: string): Promise<UserType> => {
  return Users.find((user) => user.id === userId) as UserType;
};
