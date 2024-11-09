import BreadCrumb from '@/components/global/BreadCrumb';
import { useGetAllProjects } from '@/api/projects-api';
import { ProjectType } from '@/constants/types/projectTypes';
import Loading from '@/components/loading';
import ProjectCard from '@/components/ui/projects/ProjectCard';
import ProjectFilter from '@/components/ui/projects/ProjectFilter';
import Link from 'next/link';
import Image from 'next/image';
import heroImage2 from '@/public/images/freelancer-hero-img-2.jpg';

function ProjectsContainer() {
  const { data, isLoading, isSuccess } = useGetAllProjects();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className='relative bg-gray-900'>
        <div className='bg-b300 relative h-60 overflow-hidden md:absolute md:left-0 md:h-full md:w-1/3 lg:w-1/2'>
          <Image
            alt=''
            src={heroImage2}
            className='h-full w-full object-cover'
          />
        
        </div>
        <div className='relative mx-auto max-w-7xl py-24 sm:py-32 lg:px-8 lg:py-40'>
          <div className='pl-6 pr-6 md:ml-auto md:w-2/3 md:pl-16 lg:w-1/2 lg:pl-24 lg:pr-0 xl:pl-32'>
            <h2 className='text-b300 text-base/7 font-semibold'>
              Project Catalog
            </h2>
            <p className='mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl'>
              Find Your Next Project Today
            </p>
            <p className='mt-6 text-base/7 text-gray-300'>
              Find trusted freelancers and contractors with ease. Our extensive
              network of skilled local experts—from programming and design to
              writing and beyond—is here to help you succeed, no matter the
              project.
            </p>
            <Link
              href='/auth/register'
              className='bg-b300 hover:text-n900 relative mt-8 flex items-center justify-center overflow-hidden rounded-full px-8 py-3 font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)]'
            >
              <span className='relative z-10'>Sign Up For Free</span>
            </Link>
          </div>
        </div>
      </div>

      <ProjectFilter />

      <div className='container mt-8 pb-8'>
        {isSuccess && data && (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {data.data.map((project: ProjectType) => (
              <ProjectCard
                key={project.projectId}
                tags={project.tags}
                projectId={project.projectId}
                createdAt={project.createdAt}
                projectCategory={project.projectCategory}
                projectTitle={project.projectTitle}
                projectDescription={project.projectDescription}
                priceRange={project.priceRange}
                experienceLevel={project.experienceLevel}
                expectedDeliveryTime={project.expectedDeliveryTime}
                deliveryDate={project.deliveryDate}
                location={project.location}
                projectStatus={project.projectStatus}
                clientId={project.clientId}
              />
            ))}
          </div>
        )}

        {!isLoading && (!data || data.data.length === 0) && (
          <div className='text-center text-gray-500'>No projects found</div>
        )}
      </div>
    </>
  );
}

export default ProjectsContainer;
