export interface ApplicationResponse {
  id: number;
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
