import React, { useEffect, useState } from 'react';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { CheckIcon } from 'lucide-react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';

export interface ListboxItem {
  id: string | number;
  label: string;
  value: string;
}

interface CustomListboxProps {
  items: ListboxItem[];
  name: string;
  value?: string | string[];
  multiple?: boolean;
  placeholder?: string;
  onChange: (value: string | string[]) => void;
  disabled?: boolean;
  className?: string;
}

type SingleSelected = ListboxItem | undefined;
type MultipleSelected = ListboxItem[];
type Selected = SingleSelected | MultipleSelected;

const CustomListbox = ({
  items,
  name,
  value = '',
  multiple = false,
  placeholder = 'Select option',
  onChange,
  disabled = false,
  className = '',
}: CustomListboxProps) => {
  const [selected, setSelected] = useState<Selected>(() => {
    if (multiple) {
      return items.filter(
        (item) => Array.isArray(value) && value.includes(item.value)
      );
    }
    return items.find((item) => item.value === value);
  });

  useEffect(() => {
    if (multiple) {
      const selectedItems = items.filter(
        (item) => Array.isArray(value) && value.includes(item.value)
      );
      setSelected(selectedItems);
    } else {
      const selectedItem = items.find(
        (item) => item.value === value || undefined
      );
      setSelected(selectedItem);
    }
  }, [value, items, multiple]);

  const handleChange = (selectedValue: Selected) => {
    setSelected(selectedValue);

    if (multiple && Array.isArray(selectedValue)) {
      onChange(selectedValue.map((item) => item.value));
    } else if (!multiple && !Array.isArray(selectedValue) && selectedValue) {
      onChange(selectedValue.value);
    } else {
      onChange('');
    }
  };

  const getButtonLabel = () => {
    if (!selected) return placeholder;

    if (Array.isArray(selected)) {
      return selected.length === 0
        ? placeholder
        : selected.length === 1
        ? selected[0].label
        : `${selected.length} items selected`;
    }

    return selected?.label || placeholder;
  };

  return (
    <Listbox
      value={selected as Selected}
      onChange={handleChange}
      multiple={multiple}
      disabled={disabled}
      name={name}
    >
      <div className={`relative mt-2 ${className}`}>
        <ListboxButton className='relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm'>
          <span className='block truncate'>{getButtonLabel()}</span>
          <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
            <ChevronUpDownIcon
              className='h-5 w-5 text-gray-400'
              aria-hidden='true'
            />
          </span>
        </ListboxButton>

        <ListboxOptions className='absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
          {items.map((item) => (
            <ListboxOption
              key={item.id}
              value={item}
              className={({ active, selected }) =>
                `relative cursor-default select-none py-2 pl-3 pr-9 
                ${active ? 'bg-indigo-600 text-white' : 'text-gray-900'}
                ${selected && !active ? 'bg-indigo-50' : ''}`
              }
            >
              {({ active, selected }) => (
                <>
                  <span
                    className={`block truncate ${
                      selected ? 'font-semibold' : 'font-normal'
                    }`}
                  >
                    {item.label}
                  </span>
                  {selected && (
                    <span
                      className={`absolute inset-y-0 right-0 flex items-center pr-4 
                      ${active ? 'text-white' : 'text-indigo-600'}`}
                    >
                      <CheckIcon className='h-5 w-5' aria-hidden='true' />
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
};

export default CustomListbox;
