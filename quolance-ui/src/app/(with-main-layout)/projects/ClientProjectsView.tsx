'use client';
import BreadCrumb from '@/components/global/BreadCrumb';
import { useState } from 'react';
import ProjectCard from '@/components/ui/projects/ProjectCard';

const tabButton = ['All', 'Active', 'Inactive'];

export const freelancerServices = [
  {
    id: 1,
    img: 'https://cdn.prod.website-files.com/5ded36b5e942e74b13468d23/623412971d82117b5df49b0a_00-Hero%402x.png',
    name: 'Sparkle Ease Cleaning Solutions',
    startingPrice: '$75 - &100/hr',
  },
  {
    id: 2,
    img: 'https://cdn.prod.website-files.com/5ded36b5e942e74b13468d23/623412971d82117b5df49b0a_00-Hero%402x.png',
    name: 'Home Complete Cleaning Solutions',
    startingPrice: '$50 - &100/hr',
  },
  {
    id: 3,
    img: 'https://cdn.prod.website-files.com/5ded36b5e942e74b13468d23/623412971d82117b5df49b0a_00-Hero%402x.png',
    name: 'Office New Cleaning Solution',
    startingPrice: '$50 - &150/hr',
  },
  {
    id: 4,
    img: 'https://cdn.prod.website-files.com/5ded36b5e942e74b13468d23/623412971d82117b5df49b0a_00-Hero%402x.png',
    name: 'Setup Kitchen Appience Easily',
    startingPrice: '$25 - &100/hr',
  },
];

function ClientProjectsView() {
  const [activeTab, setActiveTab] = useState('Services');

  return (
    <>
      <BreadCrumb pageName='My Projects' />
      <section className='sbp-30 stp-30'>
        <div className='container grid grid-cols-12 gap-6'>
          <div className='border-n30 col-span-12 rounded-xl border-2 border-gray-400 bg-gray-200 px-6 py-8 lg:col-span-4'></div>
          <div className='border-n30 col-span-12 rounded-xl border p-4 sm:p-8 lg:col-span-8'>
            <h3 className='heading-3'>My Projects</h3>
            <p className='text-bg-n300 pt-3 font-medium'>
              Find all your services here and view their submissions
            </p>
            <div className='flex flex-col gap-4 pt-10'>
              <ul className='border-n30 text-n100 flex items-center justify-start gap-5 border-b pb-5 max-md:flex-wrap'>
                {tabButton.map((item, idx) => (
                  <li
                    onClick={() => setActiveTab(item)}
                    className={`heading-5 cursor-pointer ${
                      activeTab === item ? 'text-n900' : ''
                    } hover:text-n900 duration-500`}
                    key={idx}
                  >
                    {item}
                  </li>
                ))}
              </ul>
              {/** Hardcoding Inactive to show no services */}
              {activeTab !== 'Inactive' && (
                <div className='flex flex-col gap-5'>
                  {freelancerServices.map((worker) => (
                    <ProjectCard
                      key={worker.id}
                      id={worker.id}
                      name={worker.name}
                      view={'client'}
                      tags={['Handyman', 'Cleaning', 'Plumber']}
                      datePosted='2021-09-23'
                      description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                      status='open'
                      applicants={5}
                    />
                  ))}
                </div>
              )}
              {/** Hardcoding Inactive to show no services */}
              {activeTab === 'Inactive' && (
                <div>
                  <h3 className='heading-7 min-h-[400px] pt-3 font-semibold'>
                    No Services Found
                  </h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ClientProjectsView;
