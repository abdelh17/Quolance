'use client';
import { StarIcon, CheckIcon } from '@heroicons/react/20/solid';
import { InboxIcon, TrashIcon, UsersIcon } from '@heroicons/react/24/outline';
import Link from "next/link";
import React from 'react';

const features = [
  {
    name: 'Create Your Profile',
    description:
      'Showcase your expertise, portfolio, and experience. The more comprehensive your profile, the more likely you are to attract quality clients.',
    href: '#',
    icon: InboxIcon,
  },
  {
    name: 'Browse Relevant Projects',
    description:
      'Our smart matching system connects you with projects that match your skills and expertise. Filter by industry, budget, and project duration.',
    href: '#',
    icon: UsersIcon,
  },
  {
    name: 'Submit Winning Proposals',
    description:
      'Stand out with personalized proposals that demonstrate your understanding of the clients needs and how your expertise can deliver results.',
    href: '#',
    icon: CheckIcon,
  },
];

const features2 = [
  {
    name: 'Global Opportunities',
    description:
      'Access projects from clients worldwide, expanding your reach beyond local markets.',
  },
  {
    name: 'Secure Payments',
    description:
      'Get paid on time, every time with our secure payment protection system.',
  },
  {
    name: 'Zero Commission',
    description:
      'Keep more of what you earn with our zero-commission policy on your earnings.',
  },
  {
    name: 'Professional Growth',
    description:
      'Build your reputation with client reviews and unlock premium opportunities.',
  }
];

function FindClientsPage() {
  return (
    <div>
      <div className='relative bg-gray-900'>
        <div className='relative h-80 overflow-hidden bg-b300 md:absolute md:left-0 md:h-full md:w-1/3 lg:w-1/2'>
          <img
            alt='Freelancer working on a project'
            src='https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
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
              Find Your Next Client
            </h2>
            <p className='mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl'>
              Connect with Quality Clients & Projects
            </p>
            <p className='mt-6 text-base/7 text-gray-300'>
              Join thousands of successful freelancers who are building their careers on our platform. 
              Access a world of opportunities and work with clients who value your expertise.
            </p>
            <div className='mt-8'>
            <Link
              href='/projects'
              className='bg-b300 hover:text-n900 relative mt-8 flex items-center justify-center overflow-hidden rounded-full px-8 py-3 font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)]'
            >
              <span className='relative z-10'>Browse Projects</span>
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
              Start your journey to freelance success with these simple steps.
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
                  src="https://images.pexels.com/photos/6779308/pexels-photo-6779308.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
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

                </svg>
                <blockquote className="text-xl/8 font-semibold text-white sm:text-2xl/9">
                  <p>
                    "Since joining this platform, I've been able to work with amazing clients from around the world. 
                    The quality of projects and the support system have helped me grow my freelance business beyond my expectations!"
                  </p>
                </blockquote>
                <figcaption className="mt-8 text-base">
                  <div className="font-semibold text-white">Sarah Fitzgerald</div>
                  <div className="mt-1 text-gray-400">UX Designer & Developer</div>
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
                Why Join Us?
              </h2>
              <p className='mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl'>
                Elevate Your Freelance Career
              </p>
              <p className='mt-6 text-base/7 text-gray-600'>
                Take control of your professional journey with tools and opportunities 
                designed to help you succeed as a freelancer.
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
            Ready to grow your business? <br />
            Start finding clients today.
          </h2>
          <div className='mt-10 flex items-center gap-x-6 lg:mt-0 lg:shrink-0'>
            <Link
              href='/auth/register'
              className='bg-b300 hover:text-n900 relative mt-8 flex items-center justify-center overflow-hidden rounded-full px-8 py-3 font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)]'
            >
              <span className='relative z-10'>Create Free Account</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FindClientsPage;