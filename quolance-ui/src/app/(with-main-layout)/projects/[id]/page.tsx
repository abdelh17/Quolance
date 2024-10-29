// app/(with-main-layout)/projects/[id]/page.tsx
'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import BreadCrumb from '@/components/global/BreadCrumb';
import { ProjectList } from '@/data/data';
import { useGetUserProfile } from '@/hooks/userHooks';
import ProjectDetails from '@/app/(with-main-layout)/projects/[id]/ProjectDetails';
import ProjectApplication from '@/app/(with-main-layout)/projects/[id]/ProjectApplication';
import ProjectSubmissions from '@/app/(with-main-layout)/projects/[id]/ProjectSubmissions';

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
  const { data: user, isLoading } = useGetUserProfile();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (id) {
      const projectId = Number(id);
      const fetchedProject = ProjectList.find((p) => p.id === projectId);
      setProject(fetchedProject || null);
    }
  }, [id]);

  if (isLoading) {
    return <div className={'mx-auto ml-10'}>Loading...</div>;
  }

  if (!project) {
    return <p className='text-error mb-6'>No project found for ID: {id}</p>;
  }

  return (
    <>
      <BreadCrumb pageName='Project Details' isSearchBoxShow={false} />

      <section className='container mt-14'>
        {/* Project Details - Visible to all users */}
        <ProjectDetails project={project} />
        <div className=''>
          <div className=''>
            {/* Application Form - Only visible to freelancers */}
            {user?.role === 'freelancer' && (
              <ProjectApplication projectId={project.id} />
            )}

            {/* Proposals List - Only visible to clients */}
            {user?.role === 'client' && (
              <ProjectSubmissions projectId={project.id} />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default ProjectPage;
