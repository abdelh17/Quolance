export interface CandidateResponse {
  id: string;
  userId: string;
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
  projectExperiences: any[];
  workExperiences: any[];
  languagesSpoken: string[];
}
