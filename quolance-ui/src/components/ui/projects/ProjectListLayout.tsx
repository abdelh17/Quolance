import ProjectFilter from '@/components/ui/projects/projectFIlter/ProjectFilter';
import { ProjectType } from '@/constants/types/project-types';
import ProjectCard from '@/components/ui/projects/ProjectCard';
import { ProjectFilterQuery } from '@/api/projects-api';
import Pagination from '@/components/ui/Pagination';
import { PageMetaData } from '@/constants/types/pagination-types';
import SortControls from '@/components/ui/pagination/SortControls';

interface ProjectListLayoutProps {
  isLoading: boolean;
  isSuccess: boolean;
  data: ProjectType[];
  query: ProjectFilterQuery;
  setQuery: (query: ProjectFilterQuery) => void;
  pageMetaData: PageMetaData;
}

const ProjectSortOptions = [
  { value: 'title', label: 'Title' },
  { value: 'id', label: 'Published date' },
  { value: 'expirationDate', label: 'Expiration date' },
];

const ProjectListLayout = ({
  isLoading,
  isSuccess,
  data,
  query,
  setQuery,
  pageMetaData,
}: ProjectListLayoutProps) => {
  return (
    <div className='medium-container mx-auto mt-8 pb-8'>
      <div className='flex flex-col gap-10 lg:flex-row'>
        {/* Sidebar with filters */}
        <div className='w-full shrink-0 lg:w-64'>
          <div className='sticky top-8'>
            <ProjectFilter query={query} setQuery={setQuery} />
          </div>
        </div>

        {/* Main content area */}
        <div className='flex-1 px-6'>
          <SortControls
            query={query}
            setQuery={setQuery}
            sortOptions={ProjectSortOptions}
            metadata={pageMetaData}
          />
          {isSuccess && data && (
            <div className='mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
              {data.map((project: ProjectType) => (
                <ProjectCard
                  key={project.id}
                  tags={project.tags}
                  id={project.id}
                  creationDate={project.creationDate}
                  category={project.category}
                  title={project.title}
                  description={project.description}
                  priceRange={project.priceRange}
                  experienceLevel={project.experienceLevel}
                  expectedDeliveryTime={project.expectedDeliveryTime}
                  expirationDate={project.expirationDate}
                  location={project.location}
                  projectStatus={project.projectStatus}
                  clientId={project.clientId}
                  hasApplied={project.hasApplied}
                />
              ))}
            </div>
          )}

          {!isLoading && (!data || data.length === 0) && (
            <div className='flex h-64 items-center justify-center'>
              <p data-test="no-projects-found" className='text-center text-gray-500'>No projects found</p>
            </div>
          )}
        </div>
      </div>
      <div className={'mb-5 mt-8 w-full'}>
        <Pagination
          metadata={pageMetaData}
          onPageChange={(pageNumber) =>
            setQuery({ ...query, page: pageNumber })
          }
        />
      </div>
    </div>
  );
};

export default ProjectListLayout;
