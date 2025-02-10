import { FreelancerProfileType } from '@/constants/models/user/UserResponse';

export interface ApplicationResponse {
  id: string;
  status: ApplicationStatus;
  projectId: string;
  freelancerId: string;
  freelancerProfile: FreelancerProfileType;
}

export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
}
