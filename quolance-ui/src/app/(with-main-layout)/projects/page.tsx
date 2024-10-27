'use client';
import { useGetUserProfile } from '@/hooks/userHooks';
import FreelancerProjectsView from '@/app/(with-main-layout)/projects/FreelancerProjectsView';
import ClientProjectsView from '@/app/(with-main-layout)/projects/ClientProjectsView';

function Projects() {
  const { data: user, isLoading } = useGetUserProfile('2');

  return (
    <>
      {user?.role === 'freelancer' && <FreelancerProjectsView />}
      {user?.role === 'client' && <ClientProjectsView />}
      {isLoading && <div className={'mx-auto ml-10'}>Loading...</div>}
    </>
  );
}

export default Projects;
