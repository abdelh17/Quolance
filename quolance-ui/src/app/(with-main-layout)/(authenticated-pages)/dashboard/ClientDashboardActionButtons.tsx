'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ClientDashboardActionButtons() {
  const router = useRouter();
  return (
    <>
      <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='bg-white shadow-md sm:rounded-lg '>
          <div className='px-4 py-5 sm:p-6'>
            <h3 className='text-base font-semibold text-gray-900'>
              Create your project
            </h3>
            <div className='mt-2 sm:flex sm:items-start sm:justify-between'>
              <div className='max-w-xl text-sm text-gray-500'>
                <p>
                  Create a project and get the best freelancers to work on it.
                  You can also browse through the candidates and select the best
                  one for your project.
                </p>
              </div>
              <div className='mt-5 sm:ml-6 sm:mt-0 sm:flex sm:shrink-0 sm:items-center'>
                <Button
                  onClick={() => router.push('/post-project')}
                  variant='default'
                  animation='default'
                  size='sm'
                  data-test='post-project-btn'
                >
                  Post a Project
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className='bg-white shadow-md sm:rounded-lg'>
          <div className='px-4 py-5 sm:p-6'>
            <h3 className='text-base font-semibold text-gray-900'>
              Browse candidates
            </h3>
            <div className='mt-2 sm:flex sm:items-start sm:justify-between'>
              <div className='max-w-xl text-sm text-gray-500'>
                <p>
                  Browse through the list of freelancers and contractors and
                  select the best one for your project.
                </p>
              </div>
              <div className='mt-5 sm:ml-6 sm:mt-0 sm:flex sm:shrink-0 sm:items-center'>
                <Button
                  onClick={() => router.push('/post-project')}
                  variant='default'
                  animation='default'
                  size='sm'
                  data-test='check-repository-btn'
                >
                  Check Repository
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
