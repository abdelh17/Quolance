'use client';
import { useState } from 'react';
import { PiMapPinBold } from 'react-icons/pi';
import RadioGroup from '../ui/RadioGroup';

function StepTwo() {
  const [active, setActive] = useState(0);
  const [isRemote, setIsRemote] = useState(true);
  return (
    <div>
      <h4 className='heading-4'>Tell us where</h4>
      <div className='pt-6 lg:pt-10'>
        <p className='text-n300 pb-4 font-medium'>Is this remote work?*</p>
        <div className='flex items-center justify-start font-medium'>
          {[true, false].map((item, idx) => (
            <button
              onClick={() => {
                setActive(idx);
                setIsRemote(item);
              }}
              key={idx}
              className={`rounded-lg ${
                idx === active ? 'bg-n900 text-white' : 'bg-n30'
              } hover:bg-n900 lg:px-15 px-10 py-3 duration-500 hover:text-white`}
            >
              {item ? 'Yes' : 'No'}
            </button>
          ))}
        </div>
      </div>

      {!isRemote && (
        <>
          <p className='text-n300 pb-4 pt-6 font-medium lg:pt-10'>
            Where should the work be done?*
          </p>

          <div className='bg-n30 flex items-center justify-start gap-3 rounded-2xl p-3'>
            <PiMapPinBold />
            <input
              type='text'
              className='w-full bg-transparent outline-none placeholder:font-medium placeholder:text-gray-500'
              placeholder='For example : Montreal, Vancouver, Toronto, etc.'
            />
          </div>
        </>
      )}

      <p className='text-n300 pb-4 pt-6 font-medium lg:pt-10'>
        What is your budget?*
      </p>
      <RadioGroup />
    </div>
  );
}

export default StepTwo;
