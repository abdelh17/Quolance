'use client';
import BreadCrumb from '@/components/global/BreadCrumb';
import { useParams, useSearchParams } from 'next/navigation';
import { useAuthGuard } from '@/api/auth-api';
import { useGetProjectInfo, useUpdateProject } from '@/api/projects-api';
import ProjectDetailsHeader from '@/components/ui/projects/ProjectDetailsHeader';
import FreelancerApplicationForm from '@/app/(with-main-layout)/projects/[id]/FreelancerApplicationForm';
import ProjectSubmissions from '@/app/(with-main-layout)/projects/[id]/ProjectSubmissions';
import { Role } from '@/models/user/UserResponse';
import { ProjectType } from '@/constants/types/project-types';
import ProjectDetailsContent from '@/components/ui/projects/ProjectDetailsContent';
import Loading from '@/components/ui/loading/loading';
import { useCallback, useEffect, useState } from 'react';
import { showToast } from '@/util/context/ToastProvider';
import { HttpErrorResponse } from '@/models/http/HttpErrorResponse';
import { getUserRoleForAPI } from '@/util/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ProjectFormValues,
  projectSchema,
} from '@/lib/validation/projectSchema';

function ProjectPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const hasEdit = searchParams.has('edit');
  const { user, isLoading: isLoadingUser } = useAuthGuard({
    middleware: 'auth',
  });
  const role = user?.role;
  const userId = user?.id;
  const projectId = Array.isArray(id) ? id[0] : id;

  const { data, isLoading: isLoadingProject } = useGetProjectInfo(
    projectId,
    getUserRoleForAPI(role),
    isLoadingUser
  );
  const project = data?.data as ProjectType;
  const isLoading = isLoadingUser || isLoadingProject;

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
      const ErrorResponse = error.response?.data as HttpErrorResponse;
      showToast(
        `Error updating project: ${ErrorResponse?.message || 'Unknown error'}`,
        'error'
      );
    },
  });

  const [editMode, setEditMode] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title ?? '',
      description: project?.description ?? '',
      category: project?.category ?? '',
      priceRange: project?.priceRange ?? '',
      experienceLevel: project?.experienceLevel ?? '',
    },
  });

  useEffect(() => {
    if (project) {
      // set the draft for legacy logic if needed
      setDraftProject(project);
      // enable edit mode
      setEditMode(
        hasEdit &&
          project.projectStatus === 'PENDING' &&
          userId === project.clientId
      );
      // ⬇️ reset form fields with latest project data
      reset({
        title: project.title,
        description: project.description,
        category: project.category,
        priceRange: project.priceRange,
        experienceLevel: project.experienceLevel,
      });
    }
  }, [project, hasEdit, userId, reset]);

  const updateDraftProject = useCallback((key: string, value: any) => {
    setDraftProject((prev) => ({ ...prev, [key]: value }));
  }, []);

  const projectData = editMode ? draftProject : project;

  const onSubmit = async (formValues: ProjectFormValues) => {
    const updatedProject = {
      ...project,
      ...formValues, // override only the editable fields
    };
    try {
      await updateProjectMutate(updatedProject);
      setEditMode(false);
      window.history.replaceState({}, '', window.location.pathname);
    } catch (error: any) {
      const ErrorResponse = error?.response?.data as HttpErrorResponse;
      showToast(
        `Error updating profile: ${ErrorResponse?.message || 'Unknown error'}`,
        'error'
      );
    }
  };

  return (
    <>
      <section className='container mt-3 pb-16'>
        <BreadCrumb pageName='Project Details' />
        {project && (
          <div className={''}>
            <div>
              <ProjectDetailsHeader
                project={projectData as ProjectType}
                editMode={editMode}
                setEditMode={setEditMode}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                reset={reset}
              />
              <ProjectDetailsContent
                project={projectData as ProjectType}
                editMode={editMode}
                setDraftProject={updateDraftProject}
                control={control}
                errors={errors}
              />
            </div>
            <div className='mt-8'>
              {/* Application Form - Only visible to freelancers */}
              {role === Role.FREELANCER && (
                <FreelancerApplicationForm
                  projectId={project.id}
                  projectStatus={project.projectStatus}
                />
              )}

              {/* Submission List - Only visible to clients who own the project */}
              {role === Role.CLIENT && userId === project.clientId && (
                <ProjectSubmissions projectId={project.id} />
              )}
            </div>
          </div>
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
