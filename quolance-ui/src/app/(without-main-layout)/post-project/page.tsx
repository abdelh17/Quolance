'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { PiCheckBold, PiXBold } from 'react-icons/pi';

import StepOne from '@/components/postProjectSteps/StepOne';
import StepTwo from '@/components/postProjectSteps/StepTwo';
import StepThree from '@/components/postProjectSteps/StepThree';

import stepIcon from '@/public/images/steps_icon.png';


const stepsName = [
  'Basic Project Information',
  'Project Scope & Requirements',
  'Timeline & Preferences',
  'Previewing & Confirmation',
];

function PostsTasksSteps() {
  const [steps, setSteps] = useState(0);

  return (
    <>
      <section className='sbp-30'>
        <div className='4xl:large-container max-4xl:container flex items-center justify-between pt-6'>
          <Link href='/' className='pt-1 text-2xl font-bold'>
            Quolance
          </Link>
          <Link
            href='/'
            className='hover:text-r300 flex items-center justify-start gap-2 text-lg font-medium duration-500'
          >
            Cancel{' '}
            <span className='ph-bold ph-x !leading-none'>
              {' '}
              <PiXBold />{' '}
            </span>
          </Link>
        </div>

        {steps < 4 && (
          <div className='stp-30 container grid grid-cols-12 gap-6'>
            <div className='col-span-12 md:col-span-4 xl:col-span-3 xl:col-start-2'>
              <div className='border-n30 rounded-3xl border p-4 sm:p-8'>
                <ul className='flex flex-col gap-8'>
                  {stepsName.map((item, idx) => (
                    <li className='relative' key={idx}>
                      {steps === idx ? (
                        <div className='bg-b50 flex w-full items-center justify-start gap-4 rounded-full p-2'>
                          <div className='bg-b300 flex items-center justify-center rounded-full p-2 !leading-none text-white'>
                            <PiCheckBold />
                          </div>
                          <p className='text-sm font-medium'>{item}</p>
                        </div>
                      ) : (
                        <div
                          className={`flex w-full items-center justify-start gap-4 rounded-full p-2 ${
                            steps > idx ? 'text-b300' : 'text-n300'
                          }`}
                        >
                          <div
                            className={`flex size-9 items-center justify-center rounded-full border-2 ${
                              steps > idx ? 'border-b300' : 'border-n300'
                            } p-2 text-sm !leading-none `}
                          >
                            {idx + 1}
                          </div>
                          <p className='text-sm font-medium '>{item}</p>
                        </div>
                      )}

                      {stepsName.length !== idx + 1 && (
                        <Image
                          src={stepIcon}
                          className='absolute -bottom-7 ltr:left-6 rtl:right-6'
                          alt=''
                        />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className='col-span-12 md:col-span-8 xl:col-span-6 xl:col-start-6'>
              <div className='border-n30 rounded-3xl border p-6 sm:p-8'>
                {steps === 0 && <StepOne />}
                {steps === 1 && <StepTwo />}
                {steps === 2 && <StepThree />}

                <div
                  className={`stp-15 flex items-center ${
                    steps > 0 ? 'justify-between gap-6' : 'justify-end'
                  }`}
                >
                  {steps > 0 && (
                    <button
                      onClick={() => setSteps(steps - 1)}
                      className='bg-n30 hover:text-n900 relative flex w-1/2 items-center justify-center overflow-hidden rounded-full px-4 py-2 text-lg font-medium duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)] lg:px-8 lg:py-3'
                    >
                      <span className='relative z-10'>Back</span>
                    </button>
                  )}
                  <button
                    onClick={() => setSteps(steps + 1)}
                    className='bg-b300 hover:text-n900 relative flex w-1/2 items-center justify-center overflow-hidden rounded-full px-4 py-2 text-lg font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)] lg:px-8 lg:py-3'
                  >
                    <span className='relative z-10'>Next</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default PostsTasksSteps;
