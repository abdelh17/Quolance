'use client';


import ServiceModal from '@/components/ui/ServiceModal';

function StepOne() {
  return (
    <div className=''>
      <h4 className='heading-4'>Project Requirements</h4>
      <p className='pb-4 pt-6 lg:pt-10'>Project Title *</p>
      <input
        type='text'
        className='bg-n30 w-full rounded-lg p-3 outline-none'
      />

      <p className='text-n300 pb-4 pt-6 font-medium lg:pt-10'>
        Detailed Project Description*
      </p>
      <textarea className='bg-n30 mt-4 min-h-[130px] w-full rounded-lg'></textarea>    
    

      <ServiceModal />
    </div>
  );
}

export default StepOne;
