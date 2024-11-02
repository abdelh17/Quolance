import { useEffect } from 'react';
import { BUDGET_OPTIONS } from '@/types/formTypes';

interface ClientBudgetRadioGroupProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ClientBudgetRadioGroup({ name, value, onChange }: ClientBudgetRadioGroupProps) {
  useEffect(() => {
    // Only set default if value is empty/undefined and we have options
    if (!value && BUDGET_OPTIONS.length > 0) {
      try {
        onChange({
          target: {
            name,
            value: BUDGET_OPTIONS[0].value
          }
        } as React.ChangeEvent<HTMLInputElement>);
      } catch (error) {
        console.error('Error setting default budget value:', error);
      }
    }
  }, [name, onChange, value]); // Added dependencies

  return (
    <fieldset>
      <div className='space-y-6'>
        {BUDGET_OPTIONS.map((budget) => (
          <div key={budget.id} className='flex items-center'>
            <input
              id={budget.id}
              type='radio'
              name={name}
              value={budget.value}
              checked={value === budget.value}
              onChange={onChange}
              className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600'
            />
            <label
              htmlFor={budget.id}
              className='ml-3 block text-sm/6 font-medium text-gray-900'
            >
              {budget.label}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
}