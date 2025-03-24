'use client';

import ExpectedDeliveryRadioGroup from '@/components/ui/client/ExpectedDeliveryRadioGroup';
import { useSteps } from '@/util/context/StepsContext';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';

// Get today's date with time set to 00:00:00 for direct comparison
const today = new Date();
today.setHours(0, 0, 0, 0);

// Create schema with date validation
const schema = z.object({
  expectedDeliveryTime: z.string().min(1, "Preferred timeline is required"),
  deliveryDate: z
    .string()
    .refine((date) => {
      if (!date) return false;
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, "Deadline cannot be in the past")
});

function StepThree({
  handleNext,
  handleBack,
}: {
  handleNext: () => void;
  handleBack: () => void;
}) {
  const { formData, setFormData } = useSteps();
  const [dateError, setDateError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      expectedDeliveryTime: formData.expectedDeliveryTime || '',
      deliveryDate: formData.deliveryDate || '',
    },
  });

  // Set form values when formData changes
  useEffect(() => {
    setValue('expectedDeliveryTime', formData.expectedDeliveryTime || '');
    setValue('deliveryDate', formData.deliveryDate || '');
  }, [formData, setValue]);

  const onSubmit = (data: any) => {
    setFormData({ ...formData, ...data });
    handleNext();
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValue('expectedDeliveryTime', value);
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValue('deliveryDate', value);
    
    // Manual validation for immediate feedback
    const selectedDate = new Date(value);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setDateError("Deadline date must be in the future");
    } else {
      setDateError("");
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className=''>
      <h4 className='heading-4'>Timeline & Project Deadline</h4>
      <p className='text-n300 pb-4 pt-6 font-medium lg:pt-10'>
        Preferred Timeline <span className='text-red-500'>* </span>
      </p>
      <ExpectedDeliveryRadioGroup
        name='expectedDeliveryTime'
        value={formData.expectedDeliveryTime || ''}
        onChange={handleRadioChange}
      />
      {errors.expectedDeliveryTime && (
        <p className='text-red-500 mt-2'>{errors.expectedDeliveryTime.message}</p>
      )}

      <p className='pb-4 pt-6 lg:pt-10'>
        Expected Deadline (Final Delivery Date){' '}
        <span className='text-red-500'>* </span>
        <div className='mb-4 mt-2 flex rounded border-l-4 border-blue-500 bg-blue-50 p-4'>
          <div className='mr-3 flex-shrink-0'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5 text-blue-500'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div>
            <p className='text-n300 text-sm'>
              What is the latest date by which you'd like the full project to be
              completed and delivered? This can be the same or later than your
              preferred timeline.
            </p>
          </div>
        </div>
      </p>
      <input
        type='date'
        {...register('deliveryDate')}
        className={`border-n900 rounded-full border px-4 py-3 outline-none ${
          (errors.deliveryDate || dateError) ? 'border-red-500' : ''
        }`}
        onChange={handleDateChange}
        min={new Date().toISOString().split('T')[0]} // HTML5 min attribute to prevent past dates
      />
      {errors.deliveryDate && (
        <p className='text-red-500 mt-2'>{errors.deliveryDate.message}</p>
      )}
      {dateError && !errors.deliveryDate && (
        <p className='text-red-500 mt-2'>{dateError}</p>
      )}

      <div className='mt-8 flex justify-center space-x-3'>
        <button
          onClick={handleBack}
          type="button"
          className='bg-n30 hover:text-n900 relative flex w-1/2 items-center justify-center overflow-hidden rounded-full px-4 py-2 text-lg font-medium duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)] lg:px-8 lg:py-3'
        >
          <span className='relative z-10'>Back</span>
        </button>
        <button
          onClick={handleSubmit(onSubmit)}
          type="button"
          className='bg-b300 hover:text-n900 relative flex w-1/2 items-center justify-center overflow-hidden rounded-full px-4 py-2 text-lg font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)] lg:px-8 lg:py-3'
        >
          <span className='relative z-10'>Next</span>
        </button>
      </div>
    </div>
  );
}

export default StepThree;