export interface ApplicationResponse {
  applicationId: number;
  status: ApplicationStatus;
  projectId: number;
  freelancerId: number;
}

export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  REJECTED = 'REJECTED',
  PENDING_CONFIRMATION = 'PENDING_CONFIRMATION',
  ACCEPTED = 'ACCEPTED',
  CANCELLED = 'CANCELLED',
}
