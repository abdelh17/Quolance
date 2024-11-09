import BreadCrumb from '@/components/global/BreadCrumb';
import { useGetAllProjects } from '@/api/projects-api';
import { ProjectType } from '@/constants/types/projectTypes';
import Loading from '@/components/loading';
import ProjectCard from '@/components/ui/projects/ProjectCard';
import ProjectFilter from '@/components/ui/projects/ProjectFilter';

function ProjectsContainer() {
  const { data, isLoading, isSuccess } = useGetAllProjects();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <BreadCrumb pageName='Projects' isSearchBoxShow={true} />
      <div className=' pb-6 text-center sm:px-6 lg:px-8'>
        <h1 className='text-4xl font-bold tracking-tight text-gray-900'>
          Contract Catalog
        </h1>
        <p className='mx-auto mt-4 max-w-xl text-base text-gray-500'>
          {' '}
          Explore a comprehensive list of available contracts tailored for
          freelancers across various fields.
        </p>
      </div>

      <ProjectFilter />

      <div className='container mt-8'>
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
