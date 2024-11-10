'use client';

import { useSteps } from '@/util/context/StepsContext';
import {
  BUDGET_OPTIONS,
  BUSINESS_CATEGORY_OPTIONS,
  EXPECTED_DELIVERY_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  getLabelFromValue,
} from '@/constants/types/form-types';

function StepFour({
  handleBack,
  submitForm,
}: {
  handleBack: () => void;
  submitForm: () => void;
}) {
  const { formData } = useSteps();

  return (
    <div className=''>
      <h4 className='heading-4'>Review & Submit</h4>
      <div>
        <div className='px-4 sm:px-0'>
          <p className='mt-1 max-w-2xl text-sm/6 text-gray-500'>
            Confirm that the information below is correct before submitting.
          </p>
        </div>
        <div className='mt-6 border-t border-gray-100'>
          <dl className='divide-y divide-gray-100'>
            <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
              <dt className='text-sm/6 font-medium text-gray-900'>
                Project Category
              </dt>
              <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
                {getLabelFromValue(
                  BUSINESS_CATEGORY_OPTIONS,
                  formData.projectCategory
                )}
              </dd>
            </div>
            <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
              <dt className='text-sm/6 font-medium text-gray-900'>Title</dt>
              <dd className='mt-1 whitespace-pre-wrap break-words text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
                {formData.projectTitle}
              </dd>
            </div>
            <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
              <dt className='text-sm/6 font-medium text-gray-900'>
                Description
              </dt>
              <dd className='mt-1 whitespace-pre-wrap break-words text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
                {formData.projectDescription}
              </dd>
            </div>
            <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
              <dt className='text-sm/6 font-medium text-gray-900'>Location</dt>
              <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
                {formData.location}
              </dd>
            </div>
            <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
              <dt className='text-sm/6 font-medium text-gray-900'>priceRange</dt>
              <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
                {getLabelFromValue(BUDGET_OPTIONS, formData.priceRange)}
              </dd>
            </div>
            <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
              <dt className='text-sm/6 font-medium text-gray-900'>
                Experience Level
              </dt>
              <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
                {getLabelFromValue(
                  EXPERIENCE_LEVEL_OPTIONS,
                  formData.experienceLevel
                )}
              </dd>
            </div>
            <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
              <dt className='text-sm/6 font-medium text-gray-900'>
                Expected Delivery
              </dt>
              <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
                {getLabelFromValue(
                  EXPECTED_DELIVERY_OPTIONS,
                  formData.expectedDeliveryTime
                )}
              </dd>
            </div>
            <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
              <dt className='text-sm/6 font-medium text-gray-900'>
                Delivery Date
              </dt>
              <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
                {formData.deliveryDate}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className='mt-8 flex justify-center space-x-3'>
        <button
          onClick={handleBack}
          className='bg-n30 hover:text-n900 relative flex w-1/2 items-center justify-center overflow-hidden rounded-full px-4 py-2 text-lg font-medium duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)] lg:px-8 lg:py-3'
        >
          <span className='relative z-10'>Back</span>
        </button>
        <button
          onClick={submitForm}
          className='bg-b300 hover:text-n900 relative flex w-1/2 items-center justify-center overflow-hidden rounded-full px-4 py-2 text-lg font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)] lg:px-8 lg:py-3'
        >
          <span className='relative z-10'>Submit</span>
        </button>
      </div>
    </div>
  );
}

export default StepFour;
