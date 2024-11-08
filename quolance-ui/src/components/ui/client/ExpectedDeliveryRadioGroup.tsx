import React, { useEffect } from 'react';

import { EXPECTED_DELIVERY_OPTIONS } from '@/constants/types/formTypes';

interface ExpectedDeliveryRadioGroupProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ExpectedDeliveryRadioGroup({
  name,
  value,
  onChange,
}: ExpectedDeliveryRadioGroupProps) {
  useEffect(() => {
    if (!value) {
      onChange({
        target: {
          name,
          value: EXPECTED_DELIVERY_OPTIONS[0].value,
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [name, onChange, value]);

  return (
    <fieldset>
      <div className='space-y-6'>
        {EXPECTED_DELIVERY_OPTIONS.map((item) => (
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
