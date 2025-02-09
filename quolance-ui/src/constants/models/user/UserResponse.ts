export interface UserResponse {
  id: number;
  role: Role;
  firstName?: string;
  lastName?: string;
  email: string;
  username:string,
  verified: boolean;
  profileImageUrl?: string;
  connectedAccounts: ConnectedAccount[];
  authorities: string[];
 }
 
 
 export interface FreelancerProfileType {
  id: number;
  userId: number;
  username: string | null;
  firstName: string;
  lastName: string;
  profileImageUrl: string | null;
  bio: string;
  contactEmail: string;
  city: string | null;
  state: string | null;
  experienceLevel: string | null;
  socialMediaLinks: string[];
  skills: string[];
  availability: string | null; // FULL_TIME, PART_TIME ...
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

export type EditModesType = {
  editProfileImage: boolean;
  editHeader: boolean;
  editAbout: boolean;
  editExperience: boolean;
  editAvailability: boolean;
  editSkills: boolean;
  editContactInformation: boolean;
  editProfile: boolean;
 };
