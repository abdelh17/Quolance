// This file should be deleted soon, instead use UserResponse.ts

export type UserType = {
  id: string;
  name: string;
  email: string;
  role: UserRoles;
  createdAt: string;
  updatedAt: string;
};

export type UserRoles = 'admin' | 'freelancer' | 'client';
