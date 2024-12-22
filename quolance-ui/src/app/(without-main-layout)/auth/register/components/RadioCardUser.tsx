'use client';
import React from 'react';
import { cn } from '@/util/utils';
import { LucideIcon } from 'lucide-react';

interface RadioCardProps {
  icon: LucideIcon;
  text: string;
  isSelected: boolean;
  onSelect: () => void;
}

const RadioCard = ({
  icon: Icon,
  text,
  isSelected,
  onSelect,
}: RadioCardProps) => {
  return (
    <div
      onClick={onSelect}
      className={cn(
        'relative flex cursor-pointer flex-col gap-5 rounded-xl border-2 bg-white p-6 pb-8',
        'transition-all duration-200',
        'hover:border-n70 hover:bg-blue-50/30',
        isSelected
          ? 'bg-blue-50/40 ring-2 ring-blue-500 ring-offset-2'
          : 'border-gray-200'
      )}
    >
      <div className='flex justify-between'>
        {/* Icon */}
        <Icon className='h-8 w-8 text-gray-600' />

        {/* Radio Circle */}
        <div className='relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-gray-300'>
          <div
            className={cn(
              'h-2.5 w-2.5 rounded-full bg-blue-500 transition-transform',
              isSelected ? 'scale-100' : 'scale-0'
            )}
          />
        </div>
      </div>

      <div className='flex items-center'>
        <h4 className='text-n700 text-xl font-medium'>{text}</h4>
      </div>
    </div>
  );
};

export default RadioCard;
