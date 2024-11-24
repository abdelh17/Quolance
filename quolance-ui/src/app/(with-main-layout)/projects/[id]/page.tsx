'use client';
import BreadCrumb from '@/components/global/BreadCrumb';
import { useParams, useSearchParams } from 'next/navigation';
import { useAuthGuard } from '@/api/auth-api';
import { useGetProjectInfo, useUpdateProject } from '@/api/projects-api';
import ProjectDetailsHeader from '@/components/ui/projects/ProjectDetailsHeader';
import ProjectApplication from '@/app/(with-main-layout)/projects/[id]/ProjectApplication';
import ProjectSubmissions from '@/app/(with-main-layout)/projects/[id]/ProjectSubmissions';
import { Role } from '@/constants/models/user/UserResponse';
import { ProjectType } from '@/constants/types/project-types';
import ProjectDetailsContent from '@/components/ui/projects/ProjectDetailsContent';
import Loading from '@/components/loading';
import { useCallback, useEffect, useState } from 'react';
import { isDeepEqual } from '@/util/objectUtils';
import { showToast } from '@/util/context/ToastProvider';

function ProjectPage() {
  const { id } = useParams();
  const hasEdit = useSearchParams().has('edit');
  const { user } = useAuthGuard({ middleware: 'auth' });
  const role = user?.role;
  const projectId = Array.isArray(id) ? id[0] : id;
  const { data, isLoading } = useGetProjectInfo(parseInt(projectId));
  const project = data?.data as ProjectType;

  // Set draft project when project is fetched
  const [draftProject, setDraftProject] = useState<ProjectType>(
    project as ProjectType
  );

  const { mutateAsync: updateProjectMutate } = useUpdateProject(project?.id, {
    onSuccess: () => {
      console.log('Project updated successfully');
      showToast('Project updated successfully', 'success');
    },
    onError: (error) => {
      console.log('Error updating project:', error);
      showToast('Error updating project', 'error');
    },
  });

  const [editMode, setEditMode] = useState(hasEdit);

  useEffect(() => {
    if (project) {
      setDraftProject(project);
      setEditMode(hasEdit);
    }
  }, [project, hasEdit]);

  const updateDraftProject = useCallback((key: string, value: any) => {
    setDraftProject((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetDraftProject = useCallback(() => {
    if (project) {
      setDraftProject(project);
    }
  }, [project]);

  const projectData = editMode ? draftProject : project;

  const handleUpdateProject = async () => {
    await updateProjectMutate(draftProject);
    setEditMode(false);
  };

  return (
    <>
      <section className='container mt-3'>
        <BreadCrumb pageName='Project Details' />
        {project && (
          <>
            <ProjectDetailsHeader
              project={projectData as ProjectType}
              editMode={editMode}
              setEditMode={setEditMode}
              isEdited={!isDeepEqual(project, draftProject)}
              resetDraftProject={resetDraftProject}
              updateProject={handleUpdateProject}
            />
            <ProjectDetailsContent
              project={projectData as ProjectType}
              editMode={editMode}
              setDraftProject={updateDraftProject}
            />
            <div className='mt-8'>
              {/* Application Form - Only visible to freelancers */}
              {role === Role.FREELANCER && (
                <ProjectApplication projectId={project.id} />
              )}

              {/* Submission List - Only visible to clients */}
              {role === Role.CLIENT && (
                <ProjectSubmissions projectId={project.id} />
              )}
            </div>
          </>
        )}
        {isLoading && <Loading />}
      </section>
      {!isLoading && !project && (
        <div className='text-center text-gray-500'>No project with id {id}</div>
      )}
    </>
  );
}

export default ProjectPage;
