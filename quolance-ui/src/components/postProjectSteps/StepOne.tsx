'use client';

import BusinessCategoryDropDown from '@/components/ui/client/BusinessCategoryDropDown';
import { useSteps } from '@/util/context/StepsContext';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  projectTitle: z.string().min(1, 'Project Title is required').max(255),
  projectDescription: z
    .string()
    .min(1, 'Project Description is required')
    .max(500),
  location: z.string().min(1, 'Location is required').max(255),
});

function StepOne({ handleNext }: { handleNext: () => void }) {
  const { formData, setFormData } = useSteps();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: formData,
  });

  const onSubmit = (data: any) => {
    setFormData({ ...formData, ...data });
    handleNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h4 className='heading-4'>Basic Project Information</h4>
      <p className='text-n300 pb-4 pt-6 font-medium lg:pt-10'>
        Project Category <span className='text-red-500'>* </span>
      </p>
      <BusinessCategoryDropDown
        name='category'
        value={formData.category || ''}
        onChange={(e) =>
          setFormData({ ...formData, category: e.target.value })
        }
      />

      <p className='pb-4 pt-6 lg:pt-10'>
        Project Title <span className='text-red-500'>* </span>
      </p>
      <input
        type='text'
        {...register('projectTitle')}
        className='bg-n30 w-full rounded-lg p-3 outline-none'
      />
      {errors.projectTitle && (
        <p className='text-red-500'>{errors.projectTitle.message}</p>
      )}

      <p className='text-n300 pb-4 pt-6 font-medium lg:pt-10'>
        Detailed Project Description <span className='text-red-500'>* </span>
      </p>
      <textarea
        {...register('projectDescription')}
        className='bg-n30 mt-4 min-h-[130px] w-full rounded-lg p-4'
      ></textarea>
      {errors.projectDescription && (
        <p className='text-red-500'>{errors.projectDescription.message}</p>
      )}

      <p className='pb-4 pt-6 lg:pt-10'>
        Location <span className='text-red-500'>* </span>
      </p>
      <input
        type='text'
        {...register('location')}
        className='bg-n30 w-full rounded-lg p-3 outline-none'
      />
      {errors.location && (
        <p className='text-red-500'>{errors.location.message}</p>
      )}

      <div className='mt-8 flex justify-center'>
        <button
          type='submit'
          className='bg-b300 hover:text-n900 relative flex w-1/2 items-center justify-center overflow-hidden rounded-full px-4 py-2 text-lg font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)] lg:px-8 lg:py-3'
        >
          <span className='relative z-10'>Next</span>
        </button>
      </div>
    </form>
  );
}

export default StepOne;
