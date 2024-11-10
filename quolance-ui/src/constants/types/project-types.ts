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

//This is the raw object that will be returned from the API (used for GET)
export type ProjectType = {
  tags: string[]; // List of tag names as strings
  projectId: number; // Unique identifier for the project
  createdAt: string; // ISO date format (e.g., "2024-11-09")
  projectCategory:
    | 'WEB_DEVELOPMENT'
    | 'GRAPHIC_DESIGN'
    | 'CONTENT_WRITING'
    | 'DIGITAL_MARKETING'
    | 'APP_DEVELOPMENT'
    | 'VIDEO_EDITING'
    | 'ANIMATION'
    | 'UI_UX_DESIGN'
    | 'DATA_ENTRY'
    | 'VIRTUAL_ASSISTANT'
    | 'E_COMMERCE'
    | 'MOBILE_DEVELOPMENT'
    | 'DATA_SCIENCE'
    | 'DESIGN'
    | string;
  projectTitle: string;
  projectDescription: string;
  priceRange:
    | 'LESS_500'
    | 'BETWEEN_500_AND_1000'
    | 'BETWEEN_1000_5000'
    | 'BETWEEN_5000_10000'
    | 'MORE_10000'
    | string;
  experienceLevel: 'JUNIOR' | 'INTERMEDIATE' | 'EXPERT' | string;
  expectedDeliveryTime:
    | 'IMMEDIATELY'
    | 'WITHIN_A_WEEK'
    | 'WITHIN_A_MONTH'
    | 'FLEXIBLE'
    | string;
  deliveryDate: string; // ISO date format (e.g., "2024-11-09")
  location: string;
  projectStatus:
    | 'PENDING'
    | 'REJECTED_AUTOMATICALLY'
    | 'APPROVED'
    | 'REJECTED'
    | string;
  clientId: number; // Unique identifier for the client
};

//This is the type that is sent to the API (used for POST)
export type PostProjectType = {
  tags: string[]; // List of tag names as strings
  projectCategory:
    | 'WEB_DEVELOPMENT'
    | 'GRAPHIC_DESIGN'
    | 'CONTENT_WRITING'
    | 'DIGITAL_MARKETING'
    | 'APP_DEVELOPMENT'
    | 'VIDEO_EDITING'
    | 'ANIMATION'
    | 'UI_UX_DESIGN'
    | 'DATA_ENTRY'
    | 'VIRTUAL_ASSISTANT'
    | 'E_COMMERCE'
    | 'MOBILE_DEVELOPMENT'
    | 'DATA_SCIENCE'
    | 'DESIGN'
    | string;
  projectTitle: string;
  projectDescription: string;
  priceRange:
    | 'LESS_500'
    | 'BETWEEN_500_AND_1000'
    | 'BETWEEN_1000_5000'
    | 'BETWEEN_5000_10000'
    | 'MORE_10000'
    | string; // Define as needed
  experienceLevel: 'JUNIOR' | 'INTERMEDIATE' | 'EXPERT' | string;
  expectedDeliveryTime:
    | 'IMMEDIATELY'
    | 'WITHIN_A_WEEK'
    | 'WITHIN_A_MONTH'
    | 'FLEXIBLE'
    | string; // Define as needed
  deliveryDate: string; // ISO date format (e.g., "2024-11-09")
  location: string;
};

export const formatPriceRange = (priceRange: string) => {
  switch (priceRange) {
    case 'LESS_500':
      return `$0 – $500`;
    case 'BETWEEN_500_AND_1000':
      return '$500 – $1000';
    case 'BETWEEN_1000_5000':
      return '$1000 – $5000';
    case 'BETWEEN_5000_10000':
      return '$5000 – $10000';
    case 'MORE_10000':
      return '$10000+';
    default:
      return priceRange;
  }
};
