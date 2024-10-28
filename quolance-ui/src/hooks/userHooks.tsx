'use client';
import { useQuery } from '@tanstack/react-query';
import { Users } from '@/data/data';
import { UserType } from '@/types/userTypes';

/*--- Hooks ---*/
// Switch between number '2' and number '3' to see the different user roles
// '2' is a client
// '3' is a freelancer
export const useGetUserProfile = (userId = '2') => {
  return useQuery({
    queryKey: ['userRole'],
    queryFn: () => fetchUserType(userId),
    staleTime: 1000 * 60 * 5,
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
