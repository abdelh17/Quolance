'use client';

function StepFour() {
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
              <dt className='text-sm/6 font-medium text-gray-900'>Title</dt>
              <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
                Need wordpress developer for my personal business
              </dd>
            </div>
            <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
              <dt className='text-sm/6 font-medium text-gray-900'>
                Description
              </dt>
              <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Excepturi magnam ullam dolore odit saepe nam explicabo
                laboriosam odio unde, temporibus ab cumque expedita molestiae,
                corporis sed natus reiciendis aliquid suscipit?
              </dd>
            </div>
            <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
              <dt className='text-sm/6 font-medium text-gray-900'>
                Project Category
              </dt>
              <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
                Web Development
              </dd>
            </div>
            <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
              <dt className='text-sm/6 font-medium text-gray-900'>Location</dt>
              <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
                Montreal
              </dd>
            </div>
            <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
              <dt className='text-sm/6 font-medium text-gray-900'>Budget</dt>
              <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
                $500 to $1,000
              </dd>
            </div>
            <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
              <dt className='text-sm/6 font-medium text-gray-900'>
                Experience Level
              </dt>
              <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
                Beginner ($)
              </dd>
            </div>
            <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
              <dt className='text-sm/6 font-medium text-gray-900'>
                Expected Delivery
              </dt>
              <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
                This Month
              </dd>
            </div>
            <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
              <dt className='text-sm/6 font-medium text-gray-900'>
                Delivery Date
              </dt>
              <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>
                05/24/2025
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

export default StepFour;
