'use client';
import {
  ProjectFilterQuery,
  ProjectFilterQueryDefault,
  useGetAllPublicProjects,
} from '@/api/projects-api';
import Loading from '@/components/ui/loading/loading';
import ProjectSubListSelect from '@/components/ui/projects/projectFIlter/ProjectSubListSelect';
import Link from 'next/link';
import Image from 'next/image';
import heroImage2 from '@/public/images/freelancer-hero-img-2.jpg';
import { useState } from 'react';
import ProjectListLayout from '@/components/ui/projects/ProjectListLayout';
import { useAuthGuard } from '@/api/auth-api';
import { Role } from '@/models/user/UserResponse';
import { useGetFreelancerProjects } from '@/api/freelancer-api';
import { useGetAllClientProjects } from '@/api/client-api';

function ProjectsContainer() {
  const [currentSubList, setCurrentSubList] = useState('All Projects');
  const { user } = useAuthGuard({ middleware: 'auth' });
  const [projectQuery, setProjectQuery] = useState<ProjectFilterQuery>(
    ProjectFilterQueryDefault
  );

  const useGetFilteredProjects = (
    query: ProjectFilterQuery,
    currentSubList: string,
    role: Role | undefined
  ) => {
    const isPublicEnabled =
      currentSubList === 'All Projects' && role !== Role.FREELANCER;
    const isFreelancerEnabled = role === Role.FREELANCER;
    const isClientEnabled =
      (currentSubList === 'Posted' || currentSubList === 'Completed') &&
      role === Role.CLIENT;

    const publicProjects = useGetAllPublicProjects(query, isPublicEnabled);
    const freelancerProjects = useGetFreelancerProjects(
      query,
      isFreelancerEnabled,
      currentSubList === 'Applied'
    );
    const clientProjects = useGetAllClientProjects(
      query,
      isClientEnabled,
      currentSubList === 'Completed'
    );

    if (isPublicEnabled) return publicProjects;
    if (isFreelancerEnabled) return freelancerProjects;
    if (isClientEnabled) return clientProjects;

    return { data: null, isLoading: true, isSuccess: false };
  };

  const { data, isLoading, isSuccess } = useGetFilteredProjects(
    projectQuery,
    currentSubList,
    user?.role
  );

  const pageMetaData = data?.data.metadata;
  const projectsData = data?.data.content;

  return (
    <>
      <div className='relative bg-gray-900'>
        <div className='bg-b300 relative h-60 overflow-hidden md:absolute md:left-0 md:h-full md:w-1/3 lg:w-1/2'>
          <Image
            data-test='projects-header-img'
            alt=''
            src={heroImage2}
            className='h-full w-full object-cover'
          />
        </div>
        <div className='relative mx-auto max-w-7xl py-24 sm:py-32 lg:px-8 lg:py-40'>
          <div className='pl-6 pr-6 md:ml-auto md:w-2/3 md:pl-16 lg:w-1/2 lg:pl-24 lg:pr-0 xl:pl-32'>
            <h2
              data-test='projects-header-title'
              className='text-b300 text-base/7 font-semibold'
            >
              Project Catalog
            </h2>
            <p
              data-test='projects-header-slogan'
              className='mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl'
            >
              Find Your Next Project Today
            </p>
            <p
              data-test='projects-header-desc'
              className='mt-6 text-base/7 text-gray-300'
            >
              Discover projects that match your skills and passions. Connect
              with clients seeking talented professionals like you, and turn
              your expertise into meaningful opportunities.
            </p>
            <Link
              href='/auth/register'
              className={`bg-b300 hover:text-n900 relative mt-8 flex items-center justify-center overflow-hidden rounded-full px-8 py-3 font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)]
                          ${user ? 'hidden' : ''}`}
            >
              <span data-test='projects-header-btn' className='relative z-10'>
                Sign Up For Free
              </span>
            </Link>
          </div>
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <ProjectSubListSelect
            currentSubList={currentSubList}
            setCurrentSubList={setCurrentSubList}
          />
          <ProjectListLayout
            isLoading={isLoading}
            isSuccess={isSuccess}
            data={projectsData}
            query={projectQuery}
            setQuery={setProjectQuery}
            pageMetaData={pageMetaData}
          />
        </>
      )}
    </>
  );
}

export default ProjectsContainer;
