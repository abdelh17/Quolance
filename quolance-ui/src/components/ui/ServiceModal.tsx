'use client';

import { useState } from 'react';
import { PiCaretDown } from 'react-icons/pi';

import useClickOutside from '../../hooks/useClickOutside';

const serviceList = ['Photography', 'Renovation', 'Cleaning', 'Handyman'];

function ServiceModal() {
  const { modal, setModal, modalRef } = useClickOutside();

  const [service, setService] = useState<null | string>(null);
  return (
    <div className='relative flex cursor-pointer items-center justify-between gap-2 border border-gray-300 rounded-lg p-2 w-1/2' onClick={() => setModal((prev) => !prev)}>
      <span className='serviceText'>
        {service === null ? (
          <>
            {' '}
            <span className='max-[400px]:hidden'>Select</span> Service
          </>
        ) : (
          service
        )}
      </span>
      <PiCaretDown />

      <div
        className={`border-n30 absolute top-10 max-h-[300px] w-[150px] origin-top overflow-y-auto overflow-x-hidden rounded-3xl border bg-white py-3 text-base duration-700 max-sm:text-sm sm:-left-8 sm:w-[200px] sm:py-5 ltr:left-0 rtl:right-0 ${
          modal
            ? 'visible scale-100 opacity-100'
            : 'invisible scale-0 opacity-0'
        }`}
        ref={modalRef}
      >
        {serviceList.map((item, idx) => (
          <p
            onClick={() => {
              setService(item);
              setModal(false);
            }}
            key={idx}
            className='serviceItem hover:bg-b300 cursor-pointer px-3 py-2 text-start duration-500 hover:text-white sm:px-6'
          >
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

export default ServiceModal;
