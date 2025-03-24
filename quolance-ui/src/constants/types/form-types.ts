export interface FormFieldOption {
  id: string;
  value: string;
  label: string;
}

export const BUDGET_OPTIONS: FormFieldOption[] = [
  { id: 'budget-1', value: 'LESS_500', label: 'Less than $500' },
  { id: 'budget-2', value: 'BETWEEN_500_1000', label: '$500 to $1,000' },
  { id: 'budget-3', value: 'BETWEEN_1000_5000', label: '$1,000 to $5,000' },
  { id: 'budget-4', value: 'BETWEEN_5000_10000', label: '$5,000 to $10,000' },
  { id: 'budget-5', value: 'MORE_10000', label: '$10,000 and above' },
];

export const EXPERIENCE_LEVEL_OPTIONS: FormFieldOption[] = [
  { id: 'junior', value: 'JUNIOR', label: 'Junior ($)' },
  { id: 'intermediate', value: 'INTERMEDIATE', label: 'Intermediate ($$)' },
  { id: 'expert', value: 'EXPERT', label: 'Expert ($$$)' },
];

export const EXPECTED_DELIVERY_OPTIONS: FormFieldOption[] = [
  { id: '1-immediately', value: 'IMMEDIATELY', label: 'Immediately' },
  { id: '2-within_week', value: 'WITHIN_A_WEEK', label: 'Within a week' },
  { id: '3-within_month', value: 'WITHIN_A_MONTH', label: 'Within a month' },
  { id: '4-flexible', value: 'FLEXIBLE', label: 'Flexible' },
];

export const BUSINESS_CATEGORY_OPTIONS: FormFieldOption[] = [
  { id: '1', value: 'WEB_DEVELOPMENT', label: 'Web Development' },
  { id: '2', value: 'GRAPHIC_DESIGN', label: 'Graphic Design' },
  { id: '3', value: 'CONTENT_WRITING', label: 'Content Writing' },
  { id: '4', value: 'DIGITAL_MARKETING', label: 'Digital Marketing' },
  { id: '5', value: 'APP_DEVELOPMENT', label: 'App Development' },
  { id: '6', value: 'VIDEO_EDITING', label: 'Video Editing' },
  { id: '7', value: 'ANIMATION', label: 'Animation' },
  { id: '8', value: 'UI_UX_DESIGN', label: 'UI/UX Design' },
  { id: '9', value: 'DATA_ENTRY', label: 'Data Entry' },
  { id: '10', value: 'VIRTUAL_ASSISTANT', label: 'Virtual Assistant' },
  { id: '11', value: 'E_COMMERCE', label: 'E-commerce' },
  { id: '12', value: 'MOBILE_DEVELOPMENT', label: 'Mobile Development' },
];

export const PROJECT_STATUS_OPTIONS: FormFieldOption[] = [
  { id: 'pending', value: 'PENDING', label: 'Pending' },
  {
    id: 'rejected_automatically',
    value: 'REJECTED_AUTOMATICALLY',
    label: 'Rejected Automatically',
  },
  { id: 'approved', value: 'APPROVED', label: 'Approved' },
  { id: 'rejected', value: 'REJECTED', label: 'Rejected' },
];

export const AVAILABILITY_OPTIONS = [
  { id: 'full-time', value: 'FULL_TIME', label: 'Full Time' },
  { id: 'part-time', value: 'PART_TIME', label: 'Part Time' },
  { id: 'contract', value: 'CONTRACT', label: 'Contract' },
];

export const SKILLS_OPTIONS = [
  { id: 'angular', value: 'ANGULAR', label: 'Angular' },
  { id: 'android', value: 'ANDROID', label: 'Android' },
  { id: 'aws', value: 'AWS', label: 'AWS' },
  { id: 'azure', value: 'AZURE', label: 'Azure' },
  { id: 'c', value: 'C', label: 'C' },
  { id: 'cplusplus', value: 'CPLUSPLUS', label: 'C++' },
  { id: 'csharp', value: 'CSHARP', label: 'C#' },
  { id: 'css', value: 'CSS', label: 'CSS' },
  { id: 'django', value: 'DJANGO', label: 'Django' },
  { id: 'docker', value: 'DOCKER', label: 'Docker' },
  { id: 'express', value: 'EXPRESS', label: 'Express' },
  { id: 'flask', value: 'FLASK', label: 'Flask' },
  { id: 'flutter', value: 'FLUTTER', label: 'Flutter' },
  { id: 'gcp', value: 'GCP', label: 'GCP' },
  { id: 'go', value: 'GO', label: 'Go' },
  { id: 'html', value: 'HTML', label: 'HTML' },
  { id: 'ios', value: 'IOS', label: 'iOS' },
  { id: 'java', value: 'JAVA', label: 'Java' },
  { id: 'javascript', value: 'JAVASCRIPT', label: 'JavaScript' },
  { id: 'jenkins', value: 'JENKINS', label: 'Jenkins' },
  { id: 'kotlin', value: 'KOTLIN', label: 'Kotlin' },
  { id: 'kubernetes', value: 'KUBERNETES', label: 'Kubernetes' },
  { id: 'mongodb', value: 'MONGODB', label: 'MongoDB' },
  { id: 'mysql', value: 'MYSQL', label: 'MySQL' },
  { id: 'nestjs', value: 'NESTJS', label: 'NestJS' },
  { id: 'nextjs', value: 'NEXTJS', label: 'Next.js' },
  { id: 'node', value: 'NODE', label: 'Node.js' },
  { id: 'nuxtjs', value: 'NUXTJS', label: 'Nuxt.js' },
  { id: 'php', value: 'PHP', label: 'PHP' },
  { id: 'postgresql', value: 'POSTGRESQL', label: 'PostgreSQL' },
  { id: 'python', value: 'PYTHON', label: 'Python' },
  { id: 'react', value: 'REACT', label: 'React' },
  { id: 'reactnative', value: 'REACTNATIVE', label: 'React Native' },
  { id: 'ruby', value: 'RUBY', label: 'Ruby' },
  { id: 'rust', value: 'RUST', label: 'Rust' },
  { id: 'spring', value: 'SPRING', label: 'Spring' },
  { id: 'sql', value: 'SQL', label: 'SQL' },
  { id: 'swift', value: 'SWIFT', label: 'Swift' },
  { id: 'terraform', value: 'TERRAFORM', label: 'Terraform' },
  { id: 'typescript', value: 'TYPESCRIPT', label: 'TypeScript' },
  { id: 'vue', value: 'VUE', label: 'Vue' },
];

export const getLabelFromValue = (
  options: FormFieldOption[],
  value: string
): string => {
  return options.find((option) => option.value === value)?.label || '';
};
