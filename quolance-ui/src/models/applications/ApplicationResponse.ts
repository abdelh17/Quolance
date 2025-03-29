import { FreelancerProfileType } from '@/models/user/UserResponse';

export interface ApplicationResponse {
  id: string;
  status: ApplicationStatus;
  projectId: string;
  freelancerId: string;
  freelancerProfile: FreelancerProfileType;
  creationDate: string;
  message: string;
}

export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
}
