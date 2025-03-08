import React, { useState } from 'react';
import { Briefcase, Calendar, ExternalLink, Plus, Trash2 } from 'lucide-react';
import {
  EditModesType,
  FreelancerProfileType,
  ProjectExperience,
} from '@/constants/models/user/UserResponse';
import EditButton from './EditButton';
import SaveButton from './SaveButton';
import { formatDateObject } from '@/util/stringUtils';
import ProjectField from './ProjectField';

interface ProjectExperienceSectionProps {
  profile: FreelancerProfileType;
  handleInputChange: (field: keyof FreelancerProfileType, value: any) => void;
  updateEditModes: (value: string) => void;
  editModes: EditModesType;
  handleSave: (value: string) => void;
  checkEditModes: (value: string) => boolean;
}

const ProjectExperienceSection: React.FC<ProjectExperienceSectionProps> = ({
  profile,
  handleInputChange,
  updateEditModes,
  editModes,
  handleSave,
  checkEditModes,
}) => {
  const emptyProjectExperience: ProjectExperience = {
    id: '',
    projectName: '',
    description: '',
    startDate: undefined,
    endDate: undefined,
    projectLink: '',
  };

  const [projectExperiences, setProjectExperiences] = useState<
    ProjectExperience[]
  >(profile.projectExperiences || []);
  const [isOngoing, setIsOngoing] = useState<boolean>(false);

  const addNewProject = () => {
    const updatedProjects = [
      ...projectExperiences,
      { ...emptyProjectExperience },
    ];
    setProjectExperiences(updatedProjects);
    handleInputChange('projectExperiences', updatedProjects);
  };

  const handleProjectChange = (index: number, field: string, value: any) => {
    const updatedProjects = [...projectExperiences];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };

    if (field === 'isOngoing') {
      setIsOngoing(value);
      if (value) updatedProjects[index].endDate = undefined;
    }

    setProjectExperiences(updatedProjects);
    handleInputChange('projectExperiences', updatedProjects);
  };

  const handleDeleteProject = (index: number) => {
    const updatedProjects = [...projectExperiences];
    updatedProjects.splice(index, 1);
    setProjectExperiences(updatedProjects);
    handleInputChange('projectExperiences', updatedProjects);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return formatDateObject(new Date(dateString));
    } catch (error) {
      return '';
    }
  };

  const renderProjectForm = (project: ProjectExperience, index: number) => (
    <div
      key={`project-${index}`}
      className='bg-n10/50 mb-4 rounded-lg border p-6'
    >
      <div className='flex justify-between'>
        <div className='w-6'></div> {/* Empty space for alignment */}
        <button
          onClick={() => handleDeleteProject(index)}
          className='text-red-600 hover:text-red-700'
          title='Delete project'
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className='space-y-4'>
        {/* Project Name */}
        <ProjectField
          label='Project Name'
          name='projectName'
          value={project.projectName}
          type='text'
          isEditing={true}
          onChange={(name, value) => handleProjectChange(index, name, value)}
          placeholder='Enter project name'
          required={true}
        />

        {/* Project Description */}
        <ProjectField
          label='Description'
          name='description'
          value={project.description}
          type='textarea'
          isEditing={true}
          onChange={(name, value) => handleProjectChange(index, name, value)}
          placeholder='Describe the project and your role'
        />

        {/* Project Link */}
        <ProjectField
          label='Project Link'
          name='projectLink'
          value={project.projectLink}
          type='url'
          isEditing={true}
          onChange={(name, value) => handleProjectChange(index, name, value)}
          placeholder='https://...'
          icon={<ExternalLink size={16} />}
        />

        {/* Dates */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {/* Start Date */}
          <ProjectField
            label='Start Date'
            name='startDate'
            value={project.startDate}
            type='month-year'
            isEditing={true}
            onChange={(name, value) => handleProjectChange(index, name, value)}
            icon={<Calendar size={16} />}
          />

          {/* End Date / Ongoing */}
          <div className='space-y-2'>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id={`ongoing-${index}`}
                checked={isOngoing || false}
                onChange={(e) =>
                  handleProjectChange(index, 'isOngoing', e.target.checked)
                }
                className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              />
              <label
                htmlFor={`ongoing-${index}`}
                className='ml-2 block text-sm text-gray-700'
              >
                This is an ongoing project
              </label>
            </div>

            {isOngoing && (
              <ProjectField
                label='End Date'
                name='endDate'
                value={project.endDate}
                type='month-year'
                isEditing={true}
                onChange={(name, value) =>
                  handleProjectChange(index, name, value)
                }
                icon={<Calendar size={16} />}
                disabled={isOngoing}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className='mb-8 rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md'>
      <div className='mb-4 flex justify-between'>
        <h2 className='flex items-center self-center text-xl font-semibold text-gray-800'>
          <Briefcase className='mr-2' /> Project Experience
        </h2>
        {!editModes.editProjectExperience ? (
          <EditButton
            editModeKey='editProjectExperience'
            updateEditModes={updateEditModes}
            checkEditModes={checkEditModes}
          />
        ) : null}
      </div>

      <div>
        {editModes.editProjectExperience ? (
          <div>
            {/* All Projects */}
            {projectExperiences.map((project, index) =>
              renderProjectForm(project, index)
            )}

            {/* Add New Project Button */}
            <button
              onClick={addNewProject}
              className='mb-4 flex items-center rounded-md border border-dashed px-4 py-2 text-sm text-blue-600 hover:border-blue-800 hover:text-blue-800'
            >
              <Plus size={18} className='mr-1' /> Add Project
            </button>

            {/* Save Button */}
            <div className='mt-4'>
              <SaveButton
                editModeKey='editProjectExperience'
                handleSave={handleSave}
              />
            </div>
          </div>
        ) : (
          <div>
            {projectExperiences && projectExperiences.length > 0 ? (
              <div className='space-y-4'>
                {projectExperiences.map((project, index) => (
                  <div
                    key={`project-display-${index}`}
                    className='border-b pb-4 last:border-b-0'
                  >
                    <h4 className='font-medium text-gray-800'>
                      {project.projectName}
                    </h4>

                    <div className='my-1 flex items-center text-sm text-gray-600'>
                      <Calendar size={14} className='mr-1' />
                      <span>
                        {formatDate(project.startDate?.toString())}
                        {isOngoing
                          ? ' - Present'
                          : project.endDate
                          ? ` - ${formatDate(project.endDate?.toString())}`
                          : ''}
                      </span>
                    </div>

                    {project.description && (
                      <p className='my-1 text-sm text-gray-700'>
                        {project.description}
                      </p>
                    )}

                    {project.projectLink && (
                      <a
                        href={project.projectLink}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='mt-1 inline-flex items-center text-xs text-blue-600 hover:text-blue-800'
                      >
                        <ExternalLink size={12} className='mr-1' />
                        View Project
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className='italic text-gray-500'>
                No project experience added yet.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectExperienceSection;
