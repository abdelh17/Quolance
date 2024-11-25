import ProjectCard from '@/components/ui/projects/ProjectCard';
import React from 'react';
import image1 from '@/public/images/freelancer-hero-img-2.jpg';
import Image from 'next/image';

// Mock data for top projects
const topProjects = [
  {
    tags: ['Finance', 'Tech'],
    projectId: 1,
    createdAt: '10/10/2024',
    projectCategory: 'Finance',
    projectTitle: 'Financial Dashboard Development',
    projectDescription:
      'Develop a comprehensive financial dashboard for a fintech company.',
    priceRange: '$10,000 - $15,000',
    experienceLevel: 'Expert',
    expectedDeliveryTime: '120 Hours',
    deliveryDate: '12/12/2024',
    location: 'New York, USA',
    projectStatus: 'APPROVED',
    clientId: 101,
  },
  {
    tags: ['Healthcare', 'Data Science'],
    projectId: 2,
    createdAt: '09/05/2024',
    projectCategory: 'Healthcare',
    projectTitle: 'Patient Data Analytics',
    projectDescription:
      'Analyze patient data for trends in healthcare outcomes.',
    priceRange: '$8,000 - $12,000',
    experienceLevel: 'Advanced',
    expectedDeliveryTime: '80 Hours',
    deliveryDate: '11/15/2024',
    location: 'Toronto, Canada',
    projectStatus: 'APPROVED',
    clientId: 102,
  },
  {
    tags: ['Marketing', 'Content'],
    projectId: 3,
    createdAt: '07/25/2024',
    projectCategory: 'Marketing',
    projectTitle: 'Social Media Content Strategy',
    projectDescription:
      'Create a content strategy for increasing social media engagement.',
    priceRange: '$5,000 - $8,000',
    experienceLevel: 'Intermediate',
    expectedDeliveryTime: '60 Hours',
    deliveryDate: '11/20/2024',
    location: 'London, UK',
    projectStatus: 'APPROVED',
    clientId: 103,
  },
];

function FindClientsPage() {
  return (
    <div className='bg-gray-800 py-10 dark:bg-gray-950'>
      <div className='relative mx-auto max-w-[1400px] p-10 lg:p-16'>
        {/* Layout Container */}
        <div className='relative z-10 flex flex-col items-start gap-8 lg:flex-row'>
          {/* Image Column */}
          <div className='relative -mb-10 w-[1200px] lg:-ml-16 lg:mb-0 lg:w-[500px] xl:w-[600px]'>
            <Image
              className={
                '-mt-100 h-[1000px] rounded-xl object-cover shadow-xl shadow-gray-600 dark:shadow-gray-900/20'
              }
              src={image1}
              alt='Features Image'
              width={1000}
              height={1200}
              priority
            />
          </div>

          {/* Projects Column */}
          <div className='flex-grow rounded-xl bg-gray-100 p-8 shadow-lg dark:bg-neutral-800'>
            <h2 className='text-2xl font-bold text-gray-800 sm:text-3xl dark:text-neutral-200'>
              Interesting Projects Near You
            </h2>
            <p className='mt-4 text-gray-600 dark:text-neutral-400'>
              Discover high-quality projects that match your skills and
              interests.
            </p>

            {/* Scrollable project list */}
            <div className='scrollbar-thin scrollbar-thumb-blue-600 mt-6 grid h-[600px] gap-6 overflow-y-scroll'>
              {topProjects.map((project, index) => (
                <div
                  key={index}
                  className='rounded-lg bg-gray-100 p-6 shadow-lg dark:bg-neutral-800'
                >
                  <ProjectCard
                    tags={project.tags}
                    id={project.projectId}
                    createdAt={project.createdAt}
                    category={project.projectCategory}
                    title={project.projectTitle}
                    description={project.projectDescription}
                    priceRange={project.priceRange}
                    experienceLevel={project.experienceLevel}
                    expectedDeliveryTime={project.expectedDeliveryTime}
                    expirationDate={project.deliveryDate}
                    location={project.location}
                    projectStatus={project.projectStatus}
                    clientId={project.clientId}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Background Layer */}
        <div className='pointer-events-none absolute inset-0 grid grid-cols-12'>
          <div className='col-span-full h-full w-full rounded-xl bg-gray-100 lg:col-span-8 lg:col-start-5 dark:bg-neutral-800'></div>
        </div>
      </div>
    </div>
  );
}

export default FindClientsPage;
