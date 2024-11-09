'use client';

import ClientBudgetRadioGroup from '@/components/ui/client/ClientBudgetRadioGroup';
import DesiredExperienceLevelRadioGroup from '@/components/ui/client/DesiredExperienceLevelRadioGroup';
import { useSteps } from '@/util/context/StepsContext';

function StepTwo({
  handleNext,
  handleBack,
}: {
  handleNext: () => void;
  handleBack: () => void;
}) {
  const { formData, setFormData } = useSteps();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className=''>
      <p className='text-n300 pb-4 pt-6 font-medium lg:pt-10'>
        What is your priceRange?*
      </p>
      <ClientBudgetRadioGroup
        name='priceRange'
        value={formData.priceRange || ''}
        onChange={handleChange}
      />

      <p className='text-n300 pb-4 pt-6 font-medium lg:pt-10'>
        What experience level are you looking for in a freelancer?
        <span className='text-red-500'>* </span>
      </p>
      <DesiredExperienceLevelRadioGroup
        name='experienceLevel'
        value={formData.experienceLevel || ''}
        onChange={handleChange}
      />

      <div className='mt-8 flex justify-center space-x-3'>
        <button
          onClick={handleBack}
          className='bg-n30 hover:text-n900 relative flex w-1/2 items-center justify-center overflow-hidden rounded-full px-4 py-2 text-lg font-medium duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)] lg:px-8 lg:py-3'
        >
          <span className='relative z-10'>Back</span>
        </button>
        <button
          onClick={handleNext}
          className='bg-b300 hover:text-n900 relative flex w-1/2 items-center justify-center overflow-hidden rounded-full px-4 py-2 text-lg font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)] lg:px-8 lg:py-3'
        >
          <span className='relative z-10'>Next</span>
        </button>
      </div>
    </div>
  );
}

export default StepTwo;
