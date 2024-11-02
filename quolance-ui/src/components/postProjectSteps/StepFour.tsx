'use client';

import { useSteps } from '@/context/StepsContext';

import {
  BUDGET_OPTIONS,
  BUSINESS_CATEGORY_OPTIONS,
  EXPECTED_DELIVERY_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  getLabelFromValue,
} from '@/types/formTypes';

function StepFour() {
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
              <dt className='text-sm/6 font-medium text-gray-900'>Budget</dt>
              <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
                {getLabelFromValue(BUDGET_OPTIONS, formData.budget)}
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
                  formData.expectedDelivery
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
    </div>
  );
}

export default StepFour;
