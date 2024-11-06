import React, { SetStateAction } from 'react';
import { PiCaretDown, PiX } from 'react-icons/pi';

function WorkersFilterModal({
  filterModal,
  setFilterModal,
}: {
  filterModal: boolean;
  setFilterModal: React.Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <>
      <section
        className={`fixed left-0 right-0 top-0 z-[999] flex h-auto items-center justify-center overflow-y-auto  delay-500 duration-1000 ${
          filterModal
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0'
        }`}
      >
        <div className='mx-3 my-6 max-h-[95vh] max-w-[1175px] overflow-y-auto rounded-2xl bg-white p-8'>
          <div className='flex items-center justify-between gap-3'>
            <p className='text-xl font-medium'>All filters (0)</p>
            <button onClick={() => setFilterModal(false)}>
              <PiX className='text-2xl' />
            </button>
          </div>
          <div className='border-n30 flex w-full items-center justify-start gap-4 border-b py-6'>
            <label className='inline-flex cursor-pointer items-center'>
              <input type='checkbox' value='' className='peer sr-only' />
              <span className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></span>
            </label>

            <p className='text-n300 text-lg'>Accepting New Clients</p>
          </div>

          <div className='border-n30 border-b py-6'>
            <p className='text-xl font-medium'>Category (select one)</p>
            <div className='flex flex-wrap items-center justify-start gap-3 pt-3'>
              <div className='border-n30 flex flex-col items-center justify-center gap-3 rounded-xl border px-3 py-3 max-sm:text-sm sm:px-6 lg:px-12 lg:py-5'>
                <div className={'bg-gray-300'} />
                <p className='text-n300'>All Categories</p>
              </div>
              <div className='border-n30 flex flex-col items-center justify-center gap-3 rounded-xl border px-3 py-3 max-sm:text-sm sm:px-6 lg:px-12 lg:py-5'>
                <div className={'bg-gray-300'} />
                <p className='text-n300'>Handyman</p>
              </div>
              <div className='border-n30 flex flex-col items-center justify-center gap-3 rounded-xl border px-3 py-3 max-sm:text-sm sm:px-6 lg:px-12 lg:py-5'>
                <div className={'bg-gray-300'} />
                <p className='text-n300'>Babysitting</p>
              </div>
              <div className='border-n30 flex flex-col items-center justify-center gap-3 rounded-xl border px-3 py-3 max-sm:text-sm sm:px-6 lg:px-12 lg:py-5'>
                <div className={'bg-gray-300'} />
                <p className='text-n300'>Renovation</p>
              </div>
              <div className='border-n30 flex flex-col items-center justify-center gap-3 rounded-xl border px-3 py-3 max-sm:text-sm sm:px-6 lg:px-12 lg:py-5'>
                <div className={'bg-gray-300'} />
                <p className='text-n300'>Gardening</p>
              </div>

              <div className='border-n30 flex flex-col items-center justify-center gap-3 rounded-xl border px-3 py-3 max-sm:text-sm sm:px-6 lg:px-12 lg:py-5'>
                <div className={'bg-gray-300'} />
                <p className='text-n300'>Cleaning</p>
              </div>
              <div className='border-n30 flex flex-col items-center justify-center gap-3 rounded-xl border px-3 py-3 max-sm:text-sm sm:px-6 lg:px-12 lg:py-5'>
                <div className={'bg-gray-300'} />
                <p className='text-n300'>Others</p>
              </div>
            </div>
          </div>

          <div className='border-n30 border-b py-6'>
            <p className='pb-3 text-xl font-medium'>Services</p>
            <div className='border-n30 text-n300 flex items-center justify-between rounded-xl border px-3 py-2'>
              <p>Choose your Services</p>
              <PiCaretDown />
            </div>
          </div>

          <div className='border-n30 border-b py-6'>
            <p className='pb-3 text-xl font-medium'>
              Hourly Rate (select multiple)
            </p>
            <div className='text-n300 flex flex-wrap items-center justify-start gap-3 text-sm'>
              <p className='border-n30 rounded-2xl border px-4 py-2'>
                $25 - $50/hr
              </p>
              <p className='border-n30 rounded-2xl border px-4 py-2'>
                $50 - $75/hr
              </p>
              <p className='border-n30 rounded-2xl border px-4 py-2'>
                $75 - $100/hr
              </p>
              <p className='border-n30 rounded-2xl border px-4 py-2'>
                $100 - $150/hr
              </p>
              <p className='border-n30 rounded-2xl border px-4 py-2'>
                $150 - $200/hr
              </p>
              <p className='border-n30 rounded-2xl border px-4 py-2'>
                $200+/hr
              </p>
            </div>
          </div>

          <div className='border-n30 flex items-center justify-between gap-6 border-b py-6 max-md:flex-col'>
            <div className='w-full'>
              <p className='pb-3 text-xl font-medium'>Location</p>
              <div className='border-n30 text-n300 flex items-center justify-between rounded-xl border px-3 py-2'>
                <input
                  type='text'
                  placeholder='Type your Location'
                  className='w-full bg-transparent outline-none'
                />
              </div>
            </div>
            <div className='w-full'>
              <p className='pb-3 text-xl font-medium'>Languages</p>
              <div className='border-n30 text-n300 flex items-center justify-between rounded-xl border px-3 py-2'>
                <input
                  type='text'
                  placeholder='Type your Location'
                  className='w-full bg-transparent outline-none'
                />
              </div>
            </div>
          </div>

          <div className='flex items-end justify-end gap-6 pt-6 max-[400px]:flex-col'>
            <button className='bg-n30 hover:text-n900 relative flex items-center justify-center overflow-hidden rounded-full px-4 py-2 font-medium duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)] lg:px-8 lg:py-3'>
              <span className='relative z-10'>Clear Filters</span>
            </button>
            <button
              onClick={() => setFilterModal(false)}
              className='bg-b300 hover:text-n900 relative flex items-center justify-center overflow-hidden rounded-full px-4 py-2 font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)] lg:px-8 lg:py-3'
            >
              <span className='relative z-10'>View 120 result</span>
            </button>
          </div>
        </div>
      </section>

      <div
        className={`bg-b50/60 fixed inset-0 z-[998] duration-700 ${
          filterModal ? 'translate-y-0 opacity-100' : 'translate-y-full'
        }`}
      ></div>
    </>
  );
}

export default WorkersFilterModal;
