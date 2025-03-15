import React from 'react';
import CustomListbox, { ListboxItem } from '@/components/ui/ComboListBox';
import ViewEditField from '@/components/ui/ViewEditField';

export type FieldType = 'text' | 'textarea' | 'url' | 'select' | 'month-year';

interface Option {
  value: string;
  label: string;
}

interface ProjectFieldProps {
  label: string;
  name: string;
  value: any;
  type?: FieldType;
  isEditing: boolean;
  onChange: (name: string, value: any) => void;
  placeholder?: string;
  options?: Option[];
  required?: boolean;
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

// Generate month items for the dropdown
const monthItems: ListboxItem[] = [
  { id: '0', value: '1', label: 'January' },
  { id: '1', value: '2', label: 'February' },
  { id: '2', value: '3', label: 'March' },
  { id: '3', value: '4', label: 'April' },
  { id: '4', value: '5', label: 'May' },
  { id: '5', value: '6', label: 'June' },
  { id: '6', value: '7', label: 'July' },
  { id: '7', value: '8', label: 'August' },
  { id: '8', value: '9', label: 'September' },
  { id: '9', value: '10', label: 'October' },
  { id: '10', value: '11', label: 'November' },
  { id: '11', value: '12', label: 'December' },
];

// Generate year items for the dropdown (current year to 20 years ago)
const generateYearItems = (): ListboxItem[] => {
  const currentYear = new Date().getFullYear();
  const years: ListboxItem[] = [];

  for (let i = currentYear; i >= currentYear - 20; i--) {
    years.push({
      id: i.toString(),
      value: i.toString(),
      label: i.toString(),
    });
  }

  return years;
};

const yearItems = generateYearItems();

const ProjectField: React.FC<ProjectFieldProps> = ({
  label,
  name,
  value,
  type = 'text',
  isEditing,
  onChange,
  placeholder = '',
  options = [],
  required = false,
  className = '',
  icon,
  disabled = false,
}) => {
  const viewEditOptions = options.map((option) => ({
    value: option.value,
    label: option.label,
  }));

  const getMonthAndYear = (dateString?: string) => {
    if (!dateString) return { month: '', year: '' };

    try {
      const date = new Date(dateString);
      return {
        month: (date.getMonth() + 1).toString(),
        year: date.getFullYear().toString(),
      };
    } catch (error) {
      return { month: '', year: '' };
    }
  };

  if (type === 'month-year') {
    const { month, year } = getMonthAndYear(value);

    // For display mode
    if (!isEditing) {
      const monthLabel = monthItems.find((m) => m.value === month)?.label || '';
      return (
        <div className='space-y-1'>
          <label className='block text-sm font-medium text-gray-700'>
            {label}
          </label>
          <div className='flex items-center text-gray-900'>
            {icon && <span className='mr-2'>{icon}</span>}
            <span>
              {monthLabel} {year}
            </span>
          </div>
        </div>
      );
    }

    // For edit mode
    return (
      <div className='space-y-1'>
        <label className='block text-sm font-medium text-gray-700'>
          {label}
          {required && <span className='ml-1 text-red-500'>*</span>}
        </label>
        <div className='flex space-x-2'>
          {icon && <span className='mt-2'>{icon}</span>}
          <div className='grid flex-1 grid-cols-2 gap-2'>
            <CustomListbox
              items={monthItems}
              name={`${name}-month`}
              value={month}
              onChange={(value: string | string[]) => {
                const selectedMonth = Array.isArray(value) ? value[0] : value;
                const newDateString = year
                  ? `${year}-${selectedMonth.padStart(2, '0')}-01`
                  : '';
                onChange(name, newDateString);
              }}
              placeholder='Month'
              disabled={disabled}
            />
            <CustomListbox
              items={yearItems}
              name={`${name}-year`}
              value={year}
              onChange={(selectedYear: any) => {
                // Create a new date string and update the parent
                const newDateString = month
                  ? `${selectedYear}-${month.padStart(2, '0')}-01`
                  : '';
                onChange(name, newDateString);
              }}
              placeholder='Year'
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    );
  }

  // Special handling for URL fields
  if (type === 'url') {
    return (
      <div className='space-y-1'>
        <label className='block text-sm font-medium text-gray-700'>
          {label}
          {required && <span className='ml-1 text-red-500'>*</span>}
        </label>
        <div className='flex items-center'>
          {icon && <span className='mr-2'>{icon}</span>}
          <ViewEditField
            isEditing={isEditing}
            value={value || ''}
            onChange={onChange}
            type='text'
            placeholder={placeholder}
            required={required}
            className={className}
            name={name}
            disabled={disabled}
          />
        </div>
      </div>
    );
  }

  // For text, textarea, and select types
  return (
    <div className='space-y-1'>
      <label className='block text-sm font-medium text-gray-700'>
        {label}
        {required && <span className='ml-1 text-red-500'>*</span>}
      </label>
      <div className='flex items-center'>
        {icon && <span className='mr-2'>{icon}</span>}
        <ViewEditField
          isEditing={isEditing}
          value={value || ''}
          onChange={onChange}
          type={
            type === 'select'
              ? 'select'
              : type === 'textarea'
              ? 'textarea'
              : 'text'
          }
          options={viewEditOptions}
          placeholder={placeholder}
          required={required}
          className={className}
          name={name}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default ProjectField;
