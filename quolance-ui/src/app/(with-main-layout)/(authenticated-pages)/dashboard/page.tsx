import { Button } from '@/components/ui/button';
import DashboardTable from './DashboardTable';
import Image from 'next/image';

export default function Dashboard() {
  return (
    <>
      <div className='min-h-full'>
        <div className='relative h-[300px] overflow-hidden'>
          {' '}
          {/* Fixed height for Image component */}
          {/* Background wrapper */}
          <div className='absolute inset-0 h-full w-full'>
            <Image
              src='https://imgvisuals.com/cdn/shop/products/animated-lo-fi-background-late-night-homework-676873.gif?v=1697059026' 
              alt='Background animation'
              fill
              priority
              className='object-cover'
              sizes='50vw'
              quality={100}
            />
            {/* Dark overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-20" />
          </div>
          <header className='relative z-10'>
            <div className='mx-auto px-16 py-20 sm:px-12 lg:px-20'>
              <h1 className='mb-4 text-4xl font-bold tracking-tight text-white'>
                Welcome Back, Anes
              </h1>
              <p className='max-w-2xl text-lg text-blue-100'>
                Manage your projects and connect with top freelancers all in one
                place. Track progress, review submissions, and achieve your
                goals.
              </p>
            </div>
          </header>
        </div>

        <main>
          <div className='mx-auto px-4 py-8 sm:px-6 lg:px-8'>
            <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='bg-white shadow-md sm:rounded-lg '>
                <div className='px-4 py-5 sm:p-6'>
                  <h3 className='text-base font-semibold text-gray-900'>
                    Create your project
                  </h3>
                  <div className='mt-2 sm:flex sm:items-start sm:justify-between'>
                    <div className='max-w-xl text-sm text-gray-500'>
                      <p>
                        Create a project and get the best freelancers to work on
                        it. You can also browse through the candidates and
                        select the best one for your project.
                      </p>
                    </div>
                    <div className='mt-5 sm:ml-6 sm:mt-0 sm:flex sm:shrink-0 sm:items-center'>
                      <Button variant='default' animation='default' size='sm'>
                        Post a Project
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className='bg-white shadow-md sm:rounded-lg'>
                <div className='px-4 py-5 sm:p-6'>
                  <h3 className='text-base font-semibold text-gray-900'>
                    Browse candidats
                  </h3>
                  <div className='mt-2 sm:flex sm:items-start sm:justify-between'>
                    <div className='max-w-xl text-sm text-gray-500'>
                      <p>
                        Browse through the list of freelancers and contractors
                        and select the best one for your project.
                      </p>
                    </div>
                    <div className='mt-5 sm:ml-6 sm:mt-0 sm:flex sm:shrink-0 sm:items-center'>
                      <Button variant='default' animation='default' size='sm'>
                        Check Repository
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DashboardTable />
          </div>
        </main>
      </div>
    </>
  );
}
