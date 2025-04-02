import { z } from 'zod';

export const projectSchema = z.object({
  title: z
    .string()
    .min(1, 'Project title is required')
    .max(80, 'Project Title must contain at most 80 characters'),
  description: z
    .string()
    .min(80, 'Project Description must contain a minimum 80 characters')
    .max(5000, 'Project Description must contain at most 5000 characters'),
  category: z.string().min(1, 'Project Category is required'),
  priceRange: z.string().min(1, 'Project Budget is required'),
  experienceLevel: z.string().min(1, 'Project Experience level is required'),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
