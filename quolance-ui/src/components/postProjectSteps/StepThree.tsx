'use client';

import ExpectedDeliveryRadioGroup from '@/components/ui/client/ExpectedDeliveryRadioGroup';
import { useSteps } from '@/context/StepsContext';

function StepThree({
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
      <h4 className='heading-4'>Timeline & Delivery Preferences</h4>
      <p className='text-n300 pb-4 pt-6 font-medium lg:pt-10'>
        Expected Delivery <span className='text-red-500'>* </span>
      </p>
      <ExpectedDeliveryRadioGroup
        name='expectedDelivery'
        value={formData.expectedDelivery || ''}
        onChange={handleChange}
      />
      <p className='pb-4 pt-6 lg:pt-10'>
        Delivery Date <span className='text-red-500'>* </span>
      </p>
      <input
        type='date'
        name='deliveryDate'
        className='border-n900 rounded-full border px-4 py-3 outline-none'
        value={
          new Date(formData.deliveryDate).toISOString().split('T')[0] || ''
        }
        onChange={handleChange}
      />

      <div className='mt-8 flex justify-center space-x-3'>
        <button
          onClick={handleBack}
          className='bg-n30 w-1/2 hover:text-n900 relative flex items-center justify-center overflow-hidden rounded-full px-4 py-2 text-lg font-medium duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)] lg:px-8 lg:py-3'
        >
          <span className='relative z-10'>Back</span>
        </button>
        <button
          onClick={handleNext}
          className='bg-b300 w-1/2 hover:text-n900 relative flex items-center justify-center overflow-hidden rounded-full px-4 py-2 text-lg font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)] lg:px-8 lg:py-3'
        >
          <span className='relative z-10'>Next</span>
        </button>
      </div>
    </div>
  );
}

export default StepThree;
