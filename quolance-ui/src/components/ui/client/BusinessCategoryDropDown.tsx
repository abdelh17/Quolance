'use client';

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';
import {
  BUSINESS_CATEGORY_OPTIONS,
  FormFieldOption,
} from '@/constants/types/form-types';

interface DropDownProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BusinessCategoryDropDown({
  name,
  value,
  onChange,
}: DropDownProps) {
  const [selected, setSelected] = useState(
    BUSINESS_CATEGORY_OPTIONS.find((item) => item.value === value) ||
      BUSINESS_CATEGORY_OPTIONS[0]
  );

  useEffect(() => {
    if (!value) {
      // Set default value if no value is selected
      onChange({
        target: {
          name,
          value: BUSINESS_CATEGORY_OPTIONS[0].value,
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  }, []);

  useEffect(() => {
    setSelected(
      BUSINESS_CATEGORY_OPTIONS.find((item) => item.value === value) ||
        BUSINESS_CATEGORY_OPTIONS[0]
    );
  }, [value]);

  const handleChange = (item: FormFieldOption) => {
    setSelected(item);
    onChange({
      target: { name, value: item.value },
    } as React.ChangeEvent<HTMLInputElement>);
  };
  return (
    <Listbox value={selected} onChange={handleChange}>
      <div className='relative mt-2'>
        <ListboxButton className='relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm/6'>
          <span className='block truncate'>{selected.label}</span>
          <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
            <ChevronUpDownIcon
              aria-hidden='true'
              className='h-5 w-5 text-gray-400'
            />
          </span>
        </ListboxButton>

        <ListboxOptions
          transition
          className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm'
        >
          {BUSINESS_CATEGORY_OPTIONS.map((item) => (
            <ListboxOption
              key={item.id}
              value={item}
              className='group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white'
            >
              <span className='block truncate font-normal group-data-[selected]:font-semibold'>
                {item.label}
              </span>

              <span className='absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden'>
                <CheckIcon aria-hidden='true' className='h-5 w-5' />
              </span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
