import { Calendar } from 'lucide-react';
import React, { useEffect } from 'react';

import CustomListbox, { ListboxItem } from '@/components/ui/ComboListBox';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'url'
  | 'select'
  | 'month-year'
  | 'checkbox';

interface Option {
  value: string;
  label: string;
}

interface InputFieldProps {
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
  checkboxLabel?: string;
}

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

const generateYearItems = (): ListboxItem[] => {
  const currentYear = new Date().getFullYear();
  const years: ListboxItem[] = [];

  for (let i = currentYear; i >= currentYear - 30; i--) {
    years.push({
      id: i.toString(),
      value: i.toString(),
      label: i.toString(),
    });
  }

  return years;
};

const yearItems = generateYearItems();

const InputField: React.FC<InputFieldProps> = ({
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
  checkboxLabel,
}) => {
  const [month, setMonth] = React.useState<string | null>(null);
  const [year, setYear] = React.useState<string | null>(null);
  const [resetEndDate, setResetEndDate] = React.useState<boolean>(false);

  // Initialize month and year values for month-year type
  useEffect(() => {
    if (type == 'month-year' && value) {
      const date = new Date(value);
      setMonth((date.getMonth() + 1).toString());
      setYear(date.getFullYear().toString());
    }
  }, []);

  useEffect(() => {
    console.log('here');
    if (resetEndDate && name === 'endDate') {
      console.log('resetting end date');
      setMonth(null);
      setYear(null);
      setResetEndDate(false);
    }
  }, [name, resetEndDate]);

  // Checkbox type
  if (type === 'checkbox') {
    return (
      <div className='flex items-center'>
        <input
          type='checkbox'
          id={`checkbox-${name}`}
          checked={value || false}
          onChange={(e) => {
            setResetEndDate(true);
            onChange(name, e.target.checked);
          }}
          disabled={!isEditing || disabled}
          className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
        />
        <label
          htmlFor={`checkbox-${name}`}
          className='ml-2 block text-sm text-gray-700'
        >
          {checkboxLabel || label}
        </label>
      </div>
    );
  }

  // Month-year type
  if (type === 'month-year') {
    const handleDateChange = (newValue: string, type: 'month' | 'year') => {
      let newMonth = month;
      let newYear = year;

      if (type === 'month') {
        newMonth = newValue;
        setMonth(newValue);
      } else {
        newYear = newValue;
        setYear(newValue);
      }

      if (newMonth && newYear) {
        const date = new Date(`${newYear}-${newMonth}-10`);
        onChange(name, date);
      }
    };

    return (
      <div className='space-y-1'>
        {label && (
          <label className='block text-sm font-medium text-gray-700'>
            {label}
            {required && <span className='ml-1 text-red-500'>*</span>}
          </label>
        )}
        <div className='flex items-center space-x-2'>
          {icon && <span>{icon || <Calendar size={16} />}</span>}
          <div className='grid flex-1 grid-cols-2 gap-2'>
            <CustomListbox
              className='!mt-0'
              items={monthItems}
              name={`${name}-month`}
              multiple={false}
              value={month || ''}
              onChange={(newValue: string | string[]) => {
                handleDateChange(
                  Array.isArray(newValue) ? newValue[0] : newValue,
                  'month'
                );
              }}
              placeholder='Month'
              disabled={disabled}
            />
            <CustomListbox
              className='!mt-0'
              items={yearItems}
              name={`${name}-year`}
              value={year || ''}
              multiple={false}
              onChange={(newValue: string | string[]) => {
                handleDateChange(
                  Array.isArray(newValue) ? newValue[0] : newValue,
                  'year'
                );
              }}
              placeholder='Year'
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    );
  }

  // For text, textarea, url, and select types
  return (
    <div className='space-y-1'>
      {label && (
        <label className='block text-sm font-medium text-gray-700'>
          {label}
          {required && <span className='ml-1 text-red-500'>*</span>}
        </label>
      )}
      <div className='flex items-center'>
        {icon && <span className='mr-2'>{icon}</span>}
        {type === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            placeholder={placeholder}
            disabled={!isEditing || disabled}
            required={required}
            className='focus:ring-b300 block w-full rounded-md border-0 px-3 py-1.5 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200'
          />
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            placeholder={placeholder}
            disabled={!isEditing || disabled}
            required={required}
            className='focus:ring-b300 block w-full rounded-md border-0 px-3 py-1.5 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200'
          />
        )}
      </div>
    </div>
  );
};

export default InputField;
