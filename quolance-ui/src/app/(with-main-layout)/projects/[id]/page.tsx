'use client';

import BreadCrumb from '@/components/global/BreadCrumb';
import { useParams } from 'next/navigation';
import { useAuthGuard } from '@/api/auth-api';
import { useGetProjectInfo } from '@/api/projects-api';
import ProjectDetailsHeader from '@/components/ui/projects/ProjectDetailsHeader';
import ProjectApplication from '@/app/(with-main-layout)/projects/[id]/ProjectApplication';
import ProjectSubmissions from '@/app/(with-main-layout)/projects/[id]/ProjectSubmissions';
import { Role } from '@/constants/models/user/UserResponse';
import { ProjectType } from '@/constants/types/project-types';
import ProjectDetailsView from '@/components/ui/projects/ProjectDetailsView';

function ProjectPage() {
  const { id } = useParams();
  const { user } = useAuthGuard({ middleware: 'auth' });
  const role = user?.role;

  const projectId = Array.isArray(id) ? id[0] : id;
  const { data, isLoading } = useGetProjectInfo(parseInt(projectId));
  const project = data?.data as ProjectType;

  return (
    <>
      <section className='container mt-12'>
        <BreadCrumb pageName='Project Details' />

        {project && (
          <>
            <ProjectDetailsHeader project={project} />
            <ProjectDetailsView project={project} />
            <div className='mt-8'>
              {/* Application Form - Only visible to freelancers */}
              {role === Role.FREELANCER && (
                <ProjectApplication projectId={project.projectId} />
              )}

              {/* Submission List - Only visible to clients */}
              {role === Role.CLIENT && (
                <ProjectSubmissions projectId={project.projectId} />
              )}
            </div>
          </>
        )}
      </section>
      {!isLoading && !project && (
        <div className='text-center text-gray-500'>No projects found</div>
      )}
    </>
  );
}

export default ProjectPage;
