'use client';
import { StarIcon, CheckIcon } from '@heroicons/react/20/solid';
import { InboxIcon, TrashIcon, UsersIcon } from '@heroicons/react/24/outline';
import Link from "next/link";
import React from 'react';

const features = [
  {
    name: 'Post Your Project',
    description:
      'Clearly outline your project requirements, including the skills and expertise needed. The more details you provide, the better matches youll receive.',
    href: '#',
    icon: InboxIcon,
  },
  {
    name: 'Get Matched with Top Freelancers',
    description:
      'Our intelligent matching system suggests the best freelancers for your project. You can review profiles, portfolios, and ratings before making a decision.',
    href: '#',
    icon: UsersIcon,
  },
  {
    name: 'Collaborate & Achieve Your Goals',
    description:
      'Once youve found the right freelancer, communicate directly, set milestones, and work together to complete your project on time and within budget.',
    href: '#',
    icon: CheckIcon,
  },
];

const features2 = [
  {
    name: 'Curated Talent',
    description:
      'We ensure that only experienced and verified professionals are on our platform.',
  },
  {
    name: 'Diverse Skill Sets',
    description:
      'Find experts across technology, design, marketing, writing, and more.',
  },
  {
    name: 'Secure & Transparent',
    description:
      'Our process ensures smooth collaboration and trusted transactions.',
  },
  {
    name: 'Flexible & Scalable',
    description:
      'Hire for short-term tasks or long-term projects, based on your needs.',
  }
];

function FindAFreelancerPage() {
  return (
    <div>
      <div className='relative bg-gray-900'>
        <div className='relative h-80 overflow-hidden bg-b300 md:absolute md:left-0 md:h-full md:w-1/3 lg:w-1/2'>
          <img
            alt='Freelancer working on a project'
            src='https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            className='size-full object-cover'
          />
          <svg
            viewBox='0 0 926 676'
            aria-hidden='true'
            className='absolute -bottom-24 left-24 w-[57.875rem] transform-gpu blur-[118px]'
          >
            {/* SVG path details omitted for brevity */}
          </svg>
        </div>
        <div className='relative mx-auto max-w-7xl py-24 sm:py-32 lg:px-8 lg:py-20'>
          <div className='pl-6 pr-6 md:ml-auto md:w-2/3 md:pl-16 lg:w-1/2 lg:pl-24 lg:pr-0 xl:pl-32'>
            <h2 className='text-base/7 font-semibold text-b300'>
              Find Your Freelancer
            </h2>
            <p className='mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl'>
              Discover Top Talent for Your Projects
            </p>
            <p className='mt-6 text-base/7 text-gray-300'>
              Unlock a world of skilled professionals ready to bring your ideas to life. 
              Whether you need a developer, designer, marketer, or writer, our platform 
              connects you with the right talent to get the job done.
            </p>
            <div className='mt-8'>
            <Link
              href='/projects'
              className='bg-b300 hover:text-n900 relative mt-8 flex items-center justify-center overflow-hidden rounded-full px-8 py-3 font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)]'
            >
              <span className='relative z-10'>Browse Freelancers</span>
            </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className='bg-white py-18 sm:py-20'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='mx-auto max-w-2xl lg:mx-0'>
            <h2 className='text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl'>
              How It Works
            </h2>
            <p className='mt-6 text-lg/8 text-gray-600'>
              Follow these simple steps to find the perfect freelancer for your project.
            </p>
          </div>
          <div className='mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none'>
            <dl className='grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3'>
              {features.map((feature) => (
                <div key={feature.name} className='flex flex-col'>
                  <dt className='text-base/7 font-semibold text-gray-900'>
                    <div className='mb-6 flex size-10 items-center justify-center rounded-lg bg-b300'>
                      <feature.icon
                        aria-hidden='true'
                        className='size-6 text-white'
                      />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className='mt-1 flex flex-auto flex-col text-base/7 text-gray-600'>
                    <p className='flex-auto'>{feature.description}</p>
                    <p className='mt-6'>
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
      
      <div className="bg-white pb-12 pt-18 sm:pb-16 sm:pt-24 xl:pb-32">
        <div className="bg-gray-900 pb-20 sm:pb-24 xl:pb-0">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-x-8 gap-y-10 px-6 sm:gap-y-8 lg:px-8 xl:flex-row xl:items-stretch">
            <div className="-mt-8 w-full max-w-2xl xl:-mb-8 xl:w-96 xl:flex-none">
              <div className="relative aspect-[2/1] h-full md:-mx-8 xl:mx-0 xl:aspect-auto">
                <img
                  alt="Successful freelancer"
                  src="https://images.pexels.com/photos/1181293/pexels-photo-1181293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  className="absolute inset-0 size-full rounded-2xl bg-gray-800 object-cover shadow-2xl"
                />
              </div>
            </div>
            <div className="w-full max-w-2xl xl:max-w-none xl:flex-auto xl:px-16 xl:py-24">
              <figure className="relative isolate pt-6 sm:pt-12">
                <svg
                  viewBox="0 0 162 128"
                  aria-hidden="true"
                  className="absolute left-0 top-0 -z-10 h-32 stroke-white/20"
                >
                  {/* SVG path details omitted for brevity */}
                </svg>
                <blockquote className="text-xl/8 font-semibold text-white sm:text-2xl/9">
                  <p>
                    "This platform helped me connect with an incredible graphic designer who transformed my brand's identity. 
                    The process was smooth, and the results were amazing!"
                  </p>
                </blockquote>
                <figcaption className="mt-8 text-base">
                  <div className="font-semibold text-white">Alex Johnson</div>
                  <div className="mt-1 text-gray-400">Business Owner</div>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-white py-16 sm:py-20'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-5'>
            <div className='col-span-2'>
              <h2 className='text-base/7 font-semibold text-b300'>
                Why Choose Us?
              </h2>
              <p className='mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl'>
                Your Success, Our Priority
              </p>
              <p className='mt-6 text-base/7 text-gray-600'>
                We're committed to connecting you with the best freelance talent 
                to help you achieve your project goals efficiently and effectively.
              </p>
            </div>
            <dl className='col-span-3 grid grid-cols-1 gap-x-8 gap-y-10 text-base/7 text-gray-600 sm:grid-cols-2 lg:gap-y-16'>
              {features2.map((feature) => (
                <div key={feature.name} className='relative pl-9'>
                  <dt className='font-semibold text-gray-900'>
                    <CheckIcon
                      aria-hidden='true'
                      className='absolute left-0 top-1 size-5 text-b300'
                    />
                    {feature.name}
                  </dt>
                  <dd className='mt-2'>{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <div className='bg-white'>
        <div className='mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:flex lg:items-center lg:justify-between lg:px-8'>
          <h2 className='max-w-2xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl'>
            Ready to dive in? <br />
            Start your project today.
          </h2>
          <div className='mt-10 flex items-center gap-x-6 lg:mt-0 lg:shrink-0'>
            <Link
              href='/auth/register'
              className='bg-b300 hover:text-n900 relative mt-8 flex items-center justify-center overflow-hidden rounded-full px-8 py-3 font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)]'
            >
              <span className='relative z-10'>Sign Up For Free</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FindAFreelancerPage;