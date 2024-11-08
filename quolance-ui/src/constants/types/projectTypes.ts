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
  id: number;
  name: string;
  description: string;
  tags: string[];
  datePosted: string;
  status: string;
  applicants: number;
};
