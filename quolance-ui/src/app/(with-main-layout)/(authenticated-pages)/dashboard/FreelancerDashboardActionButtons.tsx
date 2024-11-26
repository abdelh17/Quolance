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
              View available projects
            </h3>
            <div className='mt-2 sm:flex sm:items-start sm:justify-between'>
              <div className='max-w-xl text-sm text-gray-500'>
                <p>
                  Browse through the list of available projects and apply to the
                  ones that interest you.
                </p>
              </div>
              <div className='mt-5 sm:ml-6 sm:mt-0 sm:flex sm:shrink-0 sm:items-center'>
                <Button
                  onClick={() => router.push('/projects')}
                  variant='default'
                  animation='default'
                  size='sm'
                >
                  See all projects
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className='bg-white shadow-md sm:rounded-lg'>
          <div className='px-4 py-5 sm:p-6'>
            <h3 className='text-base font-semibold text-gray-900'>
              Build my profile
            </h3>
            <div className='mt-2 sm:flex sm:items-start sm:justify-between'>
              <div className='max-w-xl text-sm text-gray-500'>
                <p>
                  Build your profile to showcase your skills and experience.
                  This will help clients find you and hire you for their
                  projects.
                </p>
              </div>
              <div className='mt-5 sm:ml-6 sm:mt-0 sm:flex sm:shrink-0 sm:items-center'>
                <Button
                  onClick={() => router.push('/profile')}
                  variant='default'
                  animation='default'
                  size='sm'
                >
                  Build profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
