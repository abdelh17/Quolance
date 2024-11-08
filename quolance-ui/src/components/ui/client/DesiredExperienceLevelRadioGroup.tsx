import React, { useEffect } from 'react';

import { EXPERIENCE_LEVEL_OPTIONS } from '@/constants/types/formTypes';

interface DesiredExperienceLevelRadioGroupProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function DesiredExperienceLevelRadioGroup({
  name,
  value,
  onChange,
}: DesiredExperienceLevelRadioGroupProps) {
  useEffect(() => {
    if (!value && EXPERIENCE_LEVEL_OPTIONS.length > 0) {
      try {
        onChange({
          target: {
            name,
            value: EXPERIENCE_LEVEL_OPTIONS[0].value,
          },
        } as React.ChangeEvent<HTMLInputElement>);
      } catch (error) {
        console.error('Error setting default experience level:', error);
      }
    }
  }, [name, onChange, value]);

  return (
    <fieldset>
      <div className='space-y-6'>
        {EXPERIENCE_LEVEL_OPTIONS.map((item) => (
          <div key={item.id} className='flex items-center'>
            <input
              id={item.id}
              type='radio'
              name={name}
              value={item.value}
              checked={value === item.value}
              onChange={onChange}
              className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600'
            />
            <label
              htmlFor={item.id}
              className='ml-3 block text-sm/6 font-medium text-gray-900'
            >
              {item.label}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
}
