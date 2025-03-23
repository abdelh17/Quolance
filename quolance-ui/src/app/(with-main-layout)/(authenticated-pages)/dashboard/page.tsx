'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import ClientProjectsListTable from './ClientProjectsListTable';
import FreelancerDashboardTable from './FreelancerDashboardTable';
import { useAuthGuard } from '@/api/auth-api';
import ClientDashboardActionButtons from './ClientDashboardActionButtons';
import FreelancerDashboardActionButtons from './FreelancerDashboardActionButtons';
import {
  useGetFreelancerProfile,
  useGetProfileCompletion,
} from '@/api/freelancer-api';
import { FreelancerProfileType } from '@/constants/models/user/UserResponse';
import ProfileStatus from '../(freelancer-protect-pages)/profile/components/ProfileStatus';
import ClientCandidatesListTable from './ClientCandidatesListTable';

export default function Dashboard() {
  const { user } = useAuthGuard({ middleware: 'auth' });
  const { data } = useGetFreelancerProfile(user?.username);
  const [profilePercentage, setProfilePercentage] = useState<number>(0);
  const { data: fetchedPercentage, refetch } = useGetProfileCompletion();

  const [profile, setProfile] = useState<FreelancerProfileType>({
    id: '0',
    userId: '0',
    username: '',
    firstName: '',
    lastName: '',
    profileImageUrl: '',
    bio: '',
    contactEmail: '',
    city: '',
    state: '',
    experienceLevel: '',
    socialMediaLinks: [],
    skills: [],
    availability: '',
    projectExperiences: [],
    workExperiences: [],
    languagesSpoken: [],
  });

  useEffect(() => {
    if (fetchedPercentage !== undefined) {
      setProfilePercentage(fetchedPercentage);
    }
  }, [fetchedPercentage]);

  useEffect(() => {
    if (data) {
      setProfile(data);
    }
  }, [data]);

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
            <div className='absolute inset-0 bg-black bg-opacity-20' />
          </div>
          <header className='relative z-10'>
            <div className='mx-auto px-16 py-20 sm:px-12 lg:px-20'>
              <h1 className='mb-4 text-4xl font-bold tracking-tight text-white'>
                Welcome Back, {user?.firstName}
              </h1>
              {user?.role === 'CLIENT' && (
                <p className='max-w-2xl text-lg text-blue-100'>
                  Manage your projects and connect with top freelancers all in
                  one place. Track progress, review submissions, and achieve
                  your goals.
                </p>
              )}
              {user?.role === 'FREELANCER' && (
                <p className='max-w-2xl text-lg text-blue-100'>
                  Manage your projects and connect with top clients all in one
                  place. Track progress, review submissions, and achieve your
                  goals.
                </p>
              )}
            </div>
          </header>
        </div>

        <main>
          <div className='mx-auto px-4 py-8 sm:px-6 lg:px-8'>
            {user?.role === 'CLIENT' && (
              <div>
                <ClientDashboardActionButtons />
                <ClientProjectsListTable />
                <ClientCandidatesListTable />
              </div>
            )}

            {user?.role === 'FREELANCER' && (
              <div>
                <ProfileStatus
                  profile={profile}
                  profilePercentage={profilePercentage}
                  isHidden={profilePercentage === 100}
                />
                <FreelancerDashboardActionButtons />
                <FreelancerDashboardTable />
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
