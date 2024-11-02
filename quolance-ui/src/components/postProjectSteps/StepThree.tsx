'use client';

import ExpectedDeliveryRadioGroup from '@/components/ui/client/ExpectedDeliveryRadioGroup';

import { useSteps } from '@/context/StepsContext';

function StepThree() {
  const { formData, setFormData } = useSteps();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className=''>
      <h4 className='heading-4'>Timeline & Delivery Preferences</h4>
      <p className='text-n300 pb-4 pt-6 font-medium lg:pt-10'>
        Expected Delivery <span className='text-red-500'>* </span>
      </p>
      <ExpectedDeliveryRadioGroup name='expectedDelivery' value={formData.expectedDelivery || ''} onChange={handleChange} />
      
      <p className='pb-4 pt-6 lg:pt-10'>Delivery Date <span className='text-red-500'>* </span></p>
      <input
        type='date'
        name='deliveryDate'
        className='border-n900 rounded-full border px-4 py-3 outline-none'
        value={new Date(formData.deliveryDate).toISOString().split('T')[0] || ''}
        onChange={handleChange}
      />
    </div>
  );
}

export default StepThree;