'use client';

import ExpectectedDeliveryRadioGroup from '../ui/client/ExpectedDeliveryRadioGroup';
function StepThree() {
  return (
    <div className=''>
      <h4 className='heading-4'>Timeline & Delivery Preferences</h4>
      <p className='text-n300 pb-4 pt-6 font-medium lg:pt-10'>
        Expected Delivery <span className='text-red-500'>* </span>
      </p>
      <ExpectectedDeliveryRadioGroup />
      <p className='pb-4 pt-6 lg:pt-10'>Delivery Date <span className='text-red-500'>* </span></p>

      <input
        type='date'
        className='border-n900 rounded-full border px-4 py-3 outline-none'
      />
    </div>
  );
}

export default StepThree;
