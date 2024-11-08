'use client';

import React from 'react';

import { useAuthGuard } from '@/api/auth-api';

import { Role } from '@/models/user/UserResponse';

interface RoleGuardProps {
  rolesAllowed?: Role[];
  children: React.ReactNode;
}
export default function RoleGuard({ rolesAllowed, children }: RoleGuardProps) {
  if (!rolesAllowed) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = useAuthGuard({ middleware: 'guest' });
  const isAllowed = rolesAllowed.includes(user?.role as Role);
  if (isAllowed) return children;
}
