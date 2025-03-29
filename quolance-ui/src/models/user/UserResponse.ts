export interface UserResponse {
  id: string;
  role: Role;
  firstName?: string;
  lastName?: string;
  email: string;
  username: string;
  verified: boolean;
  profileImageUrl?: string;
  connectedAccounts: ConnectedAccount[];
  authorities: string[];
}

export interface FreelancerProfileType {
  id: string;
  userId: string;
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
  projectExperiences: ProjectExperience[];
  workExperiences: WorkExperience[];
  languagesSpoken: string[];
  reviews:GetReviewType[];
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

export interface ProjectExperience {
  id: string;
  projectName?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  projectLink?: string;
  isOngoing?: boolean;
}

export interface WorkExperience {
  id: string;
  companyName: string;
  role: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
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
  editWorkExperience: boolean;
  editProjectExperience: boolean;
  editEducation: boolean;
  editLanguages: boolean;
  editCertifications: boolean;
};

export type GetReviewType = {
  title: string;
  communicationRating: number;
  qualityOfWorkRating: number;
  qualityOfDeliveryRating: number;
  overallRating: number;
  comment: string;
  clientFirstName: string;
  clientLastName: string;
  clientUsername: string;
  projectId: string;
  reviewedFreelancerId: string;
 };
 
 
 export type PostReviewType = {
  title: string;
  communicationRating: number;
  qualityOfWorkRating: number;
  qualityOfDeliveryRating: number;
  comment: string;
  projectId: string;
  reviewedFreelancerId: string;
 }
 