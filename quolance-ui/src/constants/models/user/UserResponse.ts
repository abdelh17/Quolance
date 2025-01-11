export interface UserResponse {
  id: number;
  role: Role;
  firstName?: string;
  lastName?: string;
  email: string;
  verified: boolean;
  profileImageUrl?: string;
  connectedAccounts: ConnectedAccount[];
  authorities: string[];
}

export interface FreelancerProfileType {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  username: string;
  profileImageUrl: string;
  bio: string;
  contactEmail: string;
  city: string;
  state: string;
  experienceLevel: string;
  socialMediaLinks: string[];
  skills: string[];
  availability: string; // FULL_TIME, PART_TIME ...
}

interface ConnectedAccount {
  provider: 'google' | 'github' | 'facebook' | 'okta';
  connectedAt: string;
}

export enum Role {
  CLIENT = 'CLIENT',
  FREELANCER = 'FREELANCER',
  ADMIN = 'ADMIN',
  PENDING = 'PENDING',
}
