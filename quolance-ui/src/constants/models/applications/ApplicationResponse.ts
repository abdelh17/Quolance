import { FreelancerProfileType } from '@/constants/models/user/UserResponse';

export interface ApplicationResponse {
  id: number;
  status: ApplicationStatus;
  projectId: number;
  freelancerId: number;
  freelancerProfile: FreelancerProfileType;
}

export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
}
