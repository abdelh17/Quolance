'use client';

import BusinessCategoryDropDown from '@/components/ui/client/BusinessCategoryDropDown';

import { useSteps } from '@/context/StepsContext';

function StepOne() {
  const { formData, setFormData } = useSteps();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className=''>
      <h4 className='heading-4'>Basic Project Information</h4>
      <p className='text-n300 pb-4 pt-6 font-medium lg:pt-10'>
        Project Category <span className='text-red-500'>* </span>
      </p>
      <BusinessCategoryDropDown
        name='projectCategory'
        value={formData.projectCategory || ''}
        onChange={handleChange}
      />

      <p className='pb-4 pt-6 lg:pt-10'>
        Project Title <span className='text-red-500'>* </span>
      </p>
      <input
        type='text'
        name='projectTitle'
        className='bg-n30 w-full rounded-lg p-3 outline-none'
        value={formData.projectTitle || ''}
        onChange={handleChange}
      />

      <p className='text-n300 pb-4 pt-6 font-medium lg:pt-10'>
        Detailed Project Description <span className='text-red-500'>* </span>
      </p>
      <textarea
        name='projectDescription'
        className='bg-n30 mt-4 min-h-[130px] w-full rounded-lg p-4'
        value={formData.projectDescription || ''}
        onChange={handleChange}
      ></textarea>
    </div>
  );
}

export default StepOne;
