// app/(with-main-layout)/projects/[id]/page.tsx
'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import BreadCrumb from '@/components/global/BreadCrumb';
import { DATA_ProjectList } from '@/data/data';
import ProjectDetails from '@/app/(with-main-layout)/projects/[id]/ProjectDetails';
import ProjectApplication from '@/app/(with-main-layout)/projects/[id]/ProjectApplication';
import ProjectSubmissions from '@/app/(with-main-layout)/projects/[id]/ProjectSubmissions';
import { useAuthGuard } from '@/lib/auth/use-auth';
import { Role } from '@/models/user/UserResponse';

type Project = {
  id: number;
  name: string;
  description: string;
  tags: string[];
  datePosted: string;
  status: string;
  applicants: number;
};

function ProjectPage() {
  const { id } = useParams();
  const { user } = useAuthGuard({ middleware: 'auth' });
  const role = user?.role;
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (id) {
      const projectId = Number(id);
      const fetchedProject = DATA_ProjectList.find((p) => p.id === projectId);
      setProject(fetchedProject || null);
    }
  }, [id]);

  if (!project) {
    return <p className='text-error mb-6'>No project found for ID: {id}</p>;
  }
  // quolance-ui/src/app/(with-main-layout)/projects/[id]/page.tsx:
  return (
    <>
      <BreadCrumb pageName='Project Details' isSearchBoxShow={false} />
      <section className='container mt-14'>
        {/* Project Details - Visible to all users */}
        <ProjectDetails project={project} />
        <div className=''>
          <div className=''>
            {/* Application Form - Only visible to freelancers */}
            {role === Role.FREELANCER && (
              <ProjectApplication projectId={project.id} />
            )}

            {/* Submission List - Only visible to clients */}
            {role === Role.CLIENT && (
              <ProjectSubmissions projectId={project.id} />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default ProjectPage;
