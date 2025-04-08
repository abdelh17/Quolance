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
  reviews: Reviews[];
  deleted: boolean;
}

type Reviews = {
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
