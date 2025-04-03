'use client';
import React from 'react';
import { motion } from 'framer-motion';
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
  ...rest
}: RadioCardProps) => {
  return (
    <motion.button
      {...rest}
      onClick={onSelect}
      type='button'
      aria-pressed={isSelected}
      whileHover={{ 
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 10 }
      }}
      className={cn(
        'relative flex h-[156px] w-full flex-col rounded-xl border-2 bg-white p-6 pb-8 text-left shadow-sm',
        'transition-all duration-200',
        'hover:border-blue-300 m-0 hover:bg-blue-50/30',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        isSelected
          ? 'bg-blue-50/40 ring-2 ring-blue-500 ring-offset-2 border-blue-500'
          : 'border-gray-200'
      )}
    >
      <div className='flex w-full justify-between items-center'>
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`
            p-3 rounded-xl transition-all duration-300
            ${isSelected 
              ? 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700' 
              : 'bg-gray-100 text-gray-600'
            }
          `}
        >
          <Icon
            className={`${
              isSelected ? 'h-9 w-9' : 'h-8 w-8'
            } transition-all`}
          />
        </motion.div>

        {/* Radio Circle */}
        <div className='relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-gray-300'>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: isSelected ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={cn(
              'h-2.5 w-2.5 rounded-full bg-blue-500 transition-transform',
              isSelected ? 'scale-100' : 'scale-0'
            )}
          />
        </div>
      </div>

      <div className='mt-auto flex items-center'>
        <h4 className={cn(
          'text-xl font-medium transition-colors duration-300',
          isSelected ? 'text-blue-800' : 'text-gray-700'
        )}>
          {text}
        </h4>
      </div>
    </motion.button>
  );
};

export default RadioCard;