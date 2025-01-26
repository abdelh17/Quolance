export interface CandidateResponse {
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
  availability: string;
}
