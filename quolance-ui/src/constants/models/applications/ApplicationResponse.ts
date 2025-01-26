import { FreelancerProfileType } from '@/constants/models/user/UserResponse';

export interface ApplicationResponse {
  id: number;
  status: ApplicationStatus;
  projectId: number;
  freelancerId: number;
  freelancerProfile: FreelancerProfileType; // Define FreelancerProfile type
}

export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
}
