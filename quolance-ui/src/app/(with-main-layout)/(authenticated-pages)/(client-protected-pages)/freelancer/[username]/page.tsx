'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import BreadCrumb from '@/components/global/BreadCrumb';
import { PiCaretRight, PiPaperPlaneTilt, PiStarFill } from 'react-icons/pi';
import { useGetFreelancerProfile } from '@/api/freelancer-api';
import Loading from '@/components/ui/loading/loading';
import FreelancerDefaultProfilePic from '@/public/images/freelancer_default_icon.png';
import badge from '@/public/images/verify-badge.png';
import { formatEnumString } from '@/util/stringUtils';
import { FaFacebook } from 'react-icons/fa';
import { BsInstagram, BsLinkedin, BsTwitter } from 'react-icons/bs';

const tabButton = ['Services', 'Works', 'Jobs', 'Recommendations'];

export default function FreelancerPage() {
  const [activeTab, setActiveTab] = useState('Services');
  const { username } = useParams();
  const { data: freelancer, isLoading } = useGetFreelancerProfile(
    username as string
  );

  if (isLoading) {
    return <Loading />;
  }

  if (!freelancer) {
    return <div>Freelancer not found</div>;
  }
  return (
    <>
      <section className='sbp-30 stp-30'>
        <div className='container'>
          <BreadCrumb pageName='Worker Profile' />
          <div className='grid grid-cols-12 gap-6'>
            <div className='border-n30 col-span-12 rounded-xl border px-6 py-14 lg:col-span-4'>
              <div className='flex flex-col items-center justify-center'>
                <div className='relative max-w-[180px] max-md:overflow-hidden'>
                  <Image
                    alt={`${freelancer.firstName} ${freelancer.lastName}'s profile`}
                    src={
                      freelancer.profileImageUrl || FreelancerDefaultProfilePic
                    }
                    className={`aspect-square rounded-full object-cover ring-4 ring-blue-400 ring-offset-[5px]`}
                    priority
                  />
                  <div className='absolute bottom-5 right-[-0.3rem] z-30'>
                    {/*
                      Profile badge? Might delete... (verified icon)
                      An idea: We can use the verified icon when the freelancer completes their profile
                    */}
                    <Image
                      src={badge}
                      alt='Profile badge'
                      width={36}
                      height={36}
                      className=''
                    />
                  </div>
                </div>

                <div className='flex items-center justify-center gap-3 pt-10'>
                  <h4 className='heading-4'>
                    {freelancer.firstName + ' ' + freelancer.lastName}
                  </h4>
                </div>
                <div className='w-full pt-6 sm:px-12'>
                  <Link
                    href='/chat'
                    className='bg-n700 hover:text-n900 relative block w-full overflow-hidden rounded-full px-6 py-3 text-sm font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)]'
                  >
                    <div className='relative z-20 flex items-center justify-center gap-3'>
                      <span className='text-xl !leading-none'>
                        <PiPaperPlaneTilt />
                      </span>
                      <span>Get in touch</span>
                    </div>
                  </Link>
                </div>

                {/* View Portfolio */}
                <Link
                  href='/worker-portfolio'
                  className='border-n30 mt-7 flex w-full items-center justify-between rounded-xl border px-5 py-4'
                >
                  <p className='font-semibold'>View My Portfolio</p>
                  <span className='text-xl !leading-none'>
                    <PiCaretRight />
                  </span>
                </Link>
                {/* ★ Recommended */}
                <div className='border-n30 mt-5 flex w-full items-center justify-between rounded-xl border px-5 py-3'>
                  <div className='flex items-center justify-start gap-2'>
                    <span className='text-xl !leading-none'>
                      <PiStarFill />
                    </span>
                    <p className='font-medium'>Recommended</p>
                  </div>
                  <div className='flex items-center justify-end gap-2'>
                    <div className='flex items-center justify-start max-xl:hidden'>
                      {/* Fix empty src attributes */}
                      <Image
                        src='/placeholder1.jpg'
                        alt='User'
                        width={28}
                        height={28}
                        className='bg-g75 relative -z-10 flex size-7 items-center justify-center overflow-hidden rounded-full'
                      />
                      <Image
                        src='/placeholder2.jpg'
                        alt='User'
                        width={28}
                        height={28}
                        className='-z-9 bg-g75 relative -ml-2 flex size-7 items-center justify-center overflow-hidden rounded-full'
                      />
                      <Image
                        src='/placeholder3.jpg'
                        alt='User'
                        width={28}
                        height={28}
                        className='-z-8 bg-g75 relative -ml-2 flex size-7 items-center justify-center overflow-hidden rounded-full'
                      />
                      <p className='-z-7 bg-g75 relative -ml-2 flex size-7 items-center justify-center rounded-full'>
                        +8
                      </p>
                    </div>
                    <span className='text-xl !leading-none'>
                      <PiCaretRight />
                    </span>
                  </div>
                </div>
              </div>

              {/* Experience Level */}
              <div className='flex flex-col items-start justify-start gap-3 pt-8'>
                <p className='text-sm font-medium'>EXPERIENCE LEVEL</p>
                <p className='bg-r50 text-r300 rounded-full px-3 py-1 text-[13px]'>
                  {freelancer.experienceLevel
                    ? formatEnumString(freelancer.experienceLevel)
                    : 'Not Specified'}
                </p>
              </div>

              {/* Skills */}
              <div className='flex flex-col items-start justify-start gap-3 pt-8'>
                <p className='text-sm font-medium'>SKILLS</p>
                <div className='flex flex-wrap gap-2'>
                  {freelancer.skills?.map((skill, idx) => (
                    <p
                      key={idx}
                      className='bg-b50 rounded-xl px-3 py-2 font-medium'
                    >
                      {skill}
                    </p>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className='flex flex-col items-start justify-start gap-3 pt-8'>
                <p className='text-sm font-medium'>AVAILABILITY</p>
                <p className='bg-v50 rounded-full px-3 py-1 text-[13px]'>
                  {freelancer.availability
                    ? formatEnumString(freelancer.availability)
                    : 'Not Specified'}
                </p>
              </div>

              {/* About (bio) */}
              <div className='flex flex-col items-start justify-start gap-3 pt-8'>
                <p className='text-sm font-medium'>ABOUT</p>
                <p className='text-n300'>{freelancer.bio}</p>
              </div>

              {/* Social Media Links */}
              <div className='flex flex-col items-start justify-start gap-3 pt-8'>
                <p className='text-sm font-medium'>LINKS</p>
                <div className='flex flex-wrap gap-2'>
                  <Link
                    href={'#'}
                    className='rounded-full bg-gray-100 p-3 font-medium'
                  >
                    <FaFacebook />
                  </Link>
                  <Link
                    href={'#'}
                    className='rounded-full bg-gray-100 p-3 font-medium'
                  >
                    <BsTwitter />
                  </Link>
                  <Link
                    href={'#'}
                    className='rounded-full bg-gray-100 p-3 font-medium'
                  >
                    <BsLinkedin />
                  </Link>
                  <Link
                    href={'#'}
                    className='rounded-full bg-gray-100 p-3 font-medium'
                  >
                    <BsInstagram />
                  </Link>
                </div>
              </div>
            </div>

            <div className='border-n30 col-span-12 rounded-xl border p-4 sm:p-8 lg:col-span-8'>
              <h3 className='heading-3'>Add heading for tab: {activeTab}</h3>
              <p className='text-bg-n300 pt-3 font-medium'>
                Add subtext for tab: {activeTab}
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

                {/* Tab content containers */}
                {activeTab === 'Services' && (
                  <div className='flex flex-col gap-5'>
                    {/* List of services */}
                  </div>
                )}

                {activeTab === 'Works' && (
                  <div className='flex flex-col gap-4 pt-8'>
                    {/* List of works */}
                  </div>
                )}

                {activeTab === 'Jobs' && (
                  <div className='flex flex-col gap-4 pt-8'>
                    {/* List of jobs */}
                  </div>
                )}

                {activeTab === 'Recommendations' && (
                  <div className='flex flex-col gap-4 pt-8'>
                    {/* List of recommendations */}
                    <span>
                      It was a pleasure working with Albert. He is very
                      professional
                    </span>
                    <span>
                      Albert is very professional and his work is top-notch
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
