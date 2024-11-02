'use client';

import ClientBudgetRadioGroup from '@/components/ui/client/ClientBudgetRadioGroup';
import DesiredExperienceLevelRadioGroup from '@/components/ui/client/DesiredExperienceLevelRadioGroup';

import { useSteps } from '@/context/StepsContext';

function StepTwo() {
  const { formData, setFormData } = useSteps();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className=''>
      <p className='text-n300 pb-4 pt-6 font-medium lg:pt-10'>
        What is your budget?*
      </p>
      <ClientBudgetRadioGroup name='budget' value={formData.budget || ''} onChange={handleChange} />
      
      <p className='text-n300 pb-4 pt-6 font-medium lg:pt-10'>
        What experience level are you looking for in a freelancer?
        <span className='text-red-500'>* </span>
      </p>
      <DesiredExperienceLevelRadioGroup name='experienceLevel' value={formData.experienceLevel || ''} onChange={handleChange} />
    </div>
  );
}

export default StepTwo;