import { useState } from 'react';

import { DATA_ProjectList } from '@/constants/data';

import BreadCrumb from '@/components/global/BreadCrumb';
import Pagination from '@/components/ui/Pagination';
import ProjectCard from '@/components/ui/projects/ProjectCard';
import ProjectFilter from '@/components/ui/projects/ProjectFilter';

import {
  ProjectFilterOptions,
  ProjectFilterOptionsDefault,
} from '@/constants/types/project-types';

const ITEMS_PER_PAGE = 4; // Number of services per page

function ProjectsContainer() {
  const [currentPage, setCurrentPage] = useState(1);
  const [projectFilter, setProjectFilter] = useState<ProjectFilterOptions>(
    ProjectFilterOptionsDefault
  );

  // Handle filtering logic based on date and status
  const filteredProjects = DATA_ProjectList.filter((project) =>
    projectFilter.status === 'all'
      ? true
      : project.status === projectFilter.status
  ).sort((a, b) => {
    if (projectFilter.order === 'desc') {
      return (
        new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime()
      );
    } else {
      return (
        new Date(a.datePosted).getTime() - new Date(b.datePosted).getTime()
      );
    }
  });

  // Calculate total pages based on number of filtered items
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);

  // Get the services to display for the current page
  const currentProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <BreadCrumb pageName='Projects' isSearchBoxShow={true} />

      <section className='sbp-30 stp-30'>
        <div className='container grid grid-cols-12 gap-6'>
          <ProjectFilter filter={projectFilter} setFilter={setProjectFilter} />
          <div className='border-n30 col-span-12 rounded-xl border px-3 py-4 sm:p-8 lg:col-span-8'>
            <div className='flex flex-col gap-4'>
              {currentProjects.map(({ id, ...props }) => (
                <ProjectCard key={id} id={id} {...props} />
              ))}
            </div>
            <div className='container pt-8'>
              <Pagination
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                totalPages={totalPages}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProjectsContainer;
