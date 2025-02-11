//This is the raw object that will be returned from the API (used for GET)
export type ProjectType = {
  tags: string[]; // List of tag names as strings
  id: string; // Unique identifier for the project
  createdAt: string; // ISO date format (e.g., "2024-11-09")
  category:
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
  title: string;
  description: string;
  priceRange:
    | 'LESS_500'
    | 'BETWEEN_500_1000'
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
  expirationDate: string; // ISO date format (e.g., "2024-11-09")
  location: string;
  projectStatus: ProjectStatus | string;
  clientId: string; // Unique identifier for the client
};

//This is the type that is sent to the API (used for POST)
export type PostProjectType = {
  tags: string[]; // List of tag names as strings
  category:
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
    | 'BETWEEN_500_1000'
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

export enum ProjectStatus {
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}
