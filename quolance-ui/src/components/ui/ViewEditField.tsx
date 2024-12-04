import React, { useCallback, useEffect, useState } from 'react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { Check } from 'lucide-react';
import { cn } from '@/util/utils';

type InputType = 'text' | 'select' | 'textarea' | 'email' | 'number' | 'tel';

interface Option {
  value: string;
  label: string;
}

interface ViewEditFieldProps {
  className?: string;
  isEditing: boolean;
  value: string;
  onChange: (key: string, value: string) => void;
  type?: InputType;
  options?: Option[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  rows?: number;
  id?: string;
  name: string;
  'aria-label'?: string;
  'data-testid'?: string;
}

function ViewEditField({
  className = '',
  isEditing,
  value: propValue,
  onChange,
  type = 'text',
  options = [],
  placeholder = '',
  disabled = false,
  required = false,
  maxLength,
  rows = 3,
  id,
  name,
  'aria-label': ariaLabel,
  'data-testid': dataTestId,
}: ViewEditFieldProps) {
  const [localValue, setLocalValue] = useState(propValue);

  useEffect(() => {
    setLocalValue(propValue);
  }, [propValue]);

  const debouncedOnChange = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (value: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          onChange(name, value);
        }, 400);
      };
    })(),
    [onChange, name]
  );

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const sanitizedValue = e.target.value.replace(/<[^>]*>/g, '');
      setLocalValue(sanitizedValue);
      debouncedOnChange(sanitizedValue);
    },
    [debouncedOnChange]
  );

  if (!isEditing) {
    return (
      <div className={`text-gray-900 ${className}`} data-testid={dataTestId}>
        {propValue || placeholder}
      </div>
    );
  }

  const baseInputStyles = `
    block
    w-full
    rounded-md
    border-0
    py-1.5
    px-3
    shadow-sm
    ring-1
    ring-inset
    ring-gray-300
    outline-none
    placeholder:text-gray-400
    focus:ring-2
    focus:ring-inset
    focus:ring-b300
    disabled:cursor-not-allowed
    disabled:bg-gray-50
    disabled:text-gray-500
    disabled:ring-gray-200
  `
    .trim()
    .replace(/\s+/g, ' ');

  const commonProps = {
    value: localValue,
    onChange: handleChange,
    placeholder,
    disabled,
    required,
    maxLength,
    id,
    name,
    'aria-label': ariaLabel,
    'data-testid': dataTestId,
  };

  if (type === 'select') {
    const selectedOption = options.find((opt) => opt.value === localValue);

    return (
      <Listbox
        value={
          options.find((opt) => opt.value === propValue) || {
            value: '',
            label: '',
          }
        }
        onChange={(option) => {
          onChange(name, option.value);
        }}
        disabled={disabled}
      >
        <div className='relative'>
          <ListboxButton
            className={cn(
              'relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm/6',
              !localValue && 'text-gray-400',
              disabled && 'cursor-not-allowed opacity-50',
              className
            )}
          >
            <span className='block truncate'>
              {selectedOption?.label || placeholder || 'Select an option'}
            </span>
            <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
              <ChevronUpDownIcon className='h-5 w-5 text-gray-400' />
            </span>
          </ListboxButton>

          <ListboxOptions
            transition
            className={cn(
              'absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm',
              'animate-in fade-in duration-10',
              'data-[enter]:duration-10 data-[enter]:transition data-[enter]:ease-out',
              'data-[closed]:data-[enter]:opacity-20 data-[enter-to]:opacity-100',
              'data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in',
              'data-[closed]:data-[leave]:opacity-0'
            )}
          >
            {options.map((option) => (
              <ListboxOption
                key={option.value}
                value={option}
                className={cn(
                  'group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900',
                  'data-[focus]:bg-indigo-600 data-[focus]:text-white'
                )}
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={cn(
                        'block truncate font-normal',
                        'group-data-[selected]:font-semibold'
                      )}
                    >
                      {option.label}
                    </span>

                    {selected && (
                      <span
                        className={cn(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          active ? 'text-white' : 'text-indigo-600',
                          '[.group:not([data-selected])_&]:hidden'
                        )}
                      >
                        <Check className='h-5 w-5' />
                      </span>
                    )}
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    );
  }

  if (type === 'textarea') {
    return (
      <textarea
        {...commonProps}
        rows={rows}
        className={`${baseInputStyles} min-h-[80px] resize-y ${
          className || ''
        }`}
      />
    );
  }

  return (
    <input
      {...commonProps}
      type={type}
      className={`${baseInputStyles} ${className || ''}`}
    />
  );
}

function areEqual(
  prevProps: ViewEditFieldProps,
  nextProps: ViewEditFieldProps
) {
  return (
    prevProps.value === nextProps.value &&
    prevProps.isEditing === nextProps.isEditing &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.className === nextProps.className
  );
}

export default React.memo(ViewEditField, areEqual);
