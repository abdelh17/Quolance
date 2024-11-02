export interface FormFieldOption {
    id: string;
    value: string;
    label: string;
  }
  
  export const BUDGET_OPTIONS: FormFieldOption[] = [
    { id: 'budget-1', value: '500', label: 'Less than $500' },
    { id: 'budget-2', value: '1000', label: '$500 to $1,000' },
    { id: 'budget-3', value: '5000', label: '$1,000 to $5,000' },
    { id: 'budget-4', value: '10000', label: '$5,000 to $10,000' },
    { id: 'budget-5', value: '10001', label: '$10,000 and above' },
  ];
  
  export const EXPERIENCE_LEVEL_OPTIONS: FormFieldOption[] = [
    { id: 'junior', value: 'junior', label: 'Junior ($)' },
    { id: 'intermediate', value: 'intermediate', label: 'Intermediate ($$)' },
    { id: 'expert', value: 'expert', label: 'Expert ($$$)' },
  ];
  
  export const EXPECTED_DELIVERY_OPTIONS: FormFieldOption[] = [
    { id: '1-immediately', value: 'immediately', label: 'Immediately' },
    { id: '2-this_month', value: 'this_month', label: 'This month' },
    { id: '3-next_few_months', value: 'next_few_months', label: 'In the next few months' },
    { id: '4-flexible', value: 'flexible', label: 'Flexible' },
  ];
  
  export const BUSINESS_CATEGORY_OPTIONS: FormFieldOption[] = [
    { id: '1', value: 'web_development', label: 'Web Development' },
    { id: '2', value: 'graphic_design', label: 'Graphic Design' },
    { id: '3', value: 'content_writing', label: 'Content Writing' },
    { id: '4', value: 'digital_marketing', label: 'Digital Marketing' },
    { id: '5', value: 'app_development', label: 'App Development' },
    { id: '6', value: 'video_editing', label: 'Video Editing' },
    { id: '7', value: 'animation', label: 'Animation' },
    { id: '8', value: 'ui_ux_design', label: 'UI/UX Design' },
    { id: '9', value: 'data_entry', label: 'Data Entry' },
    { id: '10', value: 'virtual_assistant', label: 'Virtual Assistant' },
    { id: '11', value: 'ecommerce', label: 'E-commerce' },
  ];
  
  export const getLabelFromValue = (options: FormFieldOption[], value: string): string => {
    return options.find(option => option.value === value)?.label || '';
  };