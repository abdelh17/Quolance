export type ProjectFilterOptions = {
  orderBy: string;
  order: 'asc' | 'desc';
  status: string; // We will use a strict type for this in the future
};

export const ProjectFilterOptionsDefault: ProjectFilterOptions = {
  orderBy: 'date',
  order: 'desc',
  status: 'all',
};

export type ProjectType = {
  tags: string[]; // List of tag names as strings
  projectId: number; // Unique identifier for the project
  createdAt: string; // ISO date format (e.g., "2024-11-09")
  projectCategory: "WEB_DEVELOPMENT" | "MOBILE_DEVELOPMENT" | "DATA_SCIENCE" | "DESIGN" | string; // Add other categories as needed
  projectTitle: string;
  projectDescription: string;
  priceRange: "LESS_500" | "BETWEEN_500_AND_1000" | "MORE_THAN_1000" | string; // Define as needed
  experienceLevel: "JUNIOR" | "MID_LEVEL" | "SENIOR" | string; // Define as needed
  expectedDeliveryTime: "IMMEDIATELY" | "WITHIN_A_WEEK" | "WITHIN_A_MONTH" | string; // Define as needed
  deliveryDate: string; // ISO date format (e.g., "2024-11-09")
  location: string;
  projectStatus: "PENDING" | "REJECTED_AUTOMATICALLY" | "APPROVED" | "REJECTED" | string; // Define as needed
  clientId: number; // Unique identifier for the client
};

