import React, { useEffect, useState } from 'react';
import { Briefcase, Calendar, Plus, Trash2 } from 'lucide-react';
import {
  EditModesType,
  FreelancerProfileType,
  WorkExperience,
} from '@/constants/models/user/UserResponse';
import EditButton from './EditButton';
import SaveButton from './SaveButton';
import ProfileInputField from './ProfileInputField';
import { Button } from '@/components/ui/button';
import { showToast } from '@/util/context/ToastProvider';

interface WorkExperienceSectionProps {
  profile: FreelancerProfileType;
  handleInputChange: (field: keyof FreelancerProfileType, value: any) => void;
  updateEditModes: (value: string) => void;
  editModes: EditModesType;
  handleSave: (value: string) => void;
  checkEditModes: (value: string) => boolean;
}

const WorkExperienceSection: React.FC<WorkExperienceSectionProps> = ({
  profile,
  handleInputChange,
  updateEditModes,
  editModes,
  handleSave,
  checkEditModes,
}) => {
  const emptyWorkExperience: WorkExperience = {
    id: '',
    companyName: '',
    role: '',
    description: '',
    startDate: new Date(),
    endDate: undefined,
  };

  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>(
    profile.workExperiences || []
  );

  useEffect(() => {
    setWorkExperiences(profile.workExperiences || []);
  }, [profile.workExperiences]);

  const addNewWorkExperience = () => {
    const updatedExperiences = [...workExperiences, { ...emptyWorkExperience }];
    setWorkExperiences(updatedExperiences);
    handleInputChange('workExperiences', updatedExperiences);
  };

  // Helper function to determine if a work experience is current
  const isCurrentPosition = (experience: WorkExperience) => {
    return !experience.endDate;
  };

  const handleWorkExperienceChange = (
    index: number,
    field: string,
    value: any
  ) => {
    const updatedExperiences = [...workExperiences];

    if (field === 'isOngoing') {
      if (value === true) {
        // If marking as current position, clear end date
        updatedExperiences[index] = {
          ...updatedExperiences[index],
          endDate: undefined,
        };
      } else {
        // If unchecking current position, set a default end date
        const defaultEndDate = new Date();
        updatedExperiences[index] = {
          ...updatedExperiences[index],
          endDate: defaultEndDate,
        };
      }
    } else if (field === 'endDate') {
      // Simply update the end date
      updatedExperiences[index] = {
        ...updatedExperiences[index],
        [field]: value,
      };
    } else {
      // For all other fields, just update normally
      updatedExperiences[index] = {
        ...updatedExperiences[index],
        [field]: value,
      };
    }

    setWorkExperiences(updatedExperiences);
    handleInputChange('workExperiences', updatedExperiences);
  };

  const handleDeleteWorkExperience = (index: number) => {
    const updatedExperiences = [...workExperiences];
    updatedExperiences.splice(index, 1);
    setWorkExperiences(updatedExperiences);
    handleInputChange('workExperiences', updatedExperiences);
  };

  const handleWorkExperienceSave = (editModeKey: string) => {
    // Check if all required fields are filled
    const requiredFields: (keyof WorkExperience)[] = ['companyName', 'role'];
    const isValidRequired = workExperiences.every((experience) =>
      requiredFields.every((field) => experience[field])
    );
    if (!isValidRequired) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    // Check if all dates are valid
    const isValidDate = workExperiences.every((experience) => {
      if (experience.startDate && experience.endDate) {
        return new Date(experience.startDate) < new Date(experience.endDate);
      }
      return true;
    });
    if (!isValidDate) {
      showToast('End date must be after start date', 'error');
      return;
    }

    handleSave(editModeKey);
  };

  const renderWorkExperienceForm = (
    experience: WorkExperience,
    index: number
  ) => {
    const isOngoing = isCurrentPosition(experience);

    return (
      <div key={`work-experience-${index}`} className='mb-6'>
        {/* Header with distinct background */}
        <div className='flex items-center justify-between rounded-t-lg border bg-gray-100 px-4 py-3'>
          <h4 className='font-medium text-gray-800'>
            {experience.companyName || 'New Position'}
          </h4>
          <button
            onClick={() => handleDeleteWorkExperience(index)}
            className='rounded p-1 text-red-500 transition-colors hover:bg-gray-200 hover:text-red-700'
            title='Delete work experience'
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Form content */}
        <div className='space-y-4 rounded-b-lg border-b border-l border-r bg-gray-50/60 p-6 pb-8'>
          {/* Company Name */}
          <ProfileInputField
            label='Company Name'
            name='companyName'
            value={experience.companyName}
            type='text'
            isEditing={true}
            onChange={(name, value) =>
              handleWorkExperienceChange(index, name, value)
            }
            placeholder='Enter company name'
            required={true}
          />
          {/* Role */}
          <ProfileInputField
            label='Role / Position'
            name='role'
            value={experience.role}
            type='text'
            isEditing={true}
            onChange={(name, value) =>
              handleWorkExperienceChange(index, name, value)
            }
            placeholder='Enter your role or position'
            required={true}
          />
          {/* Job Description */}
          <ProfileInputField
            label='Description'
            name='description'
            value={experience.description}
            type='textarea'
            isEditing={true}
            onChange={(name, value) =>
              handleWorkExperienceChange(index, name, value)
            }
            placeholder='Describe your responsibilities and achievements'
          />
          {/* Current Position Checkbox */}
          <ProfileInputField
            label=''
            name='isOngoing'
            value={isOngoing}
            type='checkbox'
            isEditing={true}
            onChange={(name, value) =>
              handleWorkExperienceChange(index, name, value)
            }
            checkboxLabel='I currently work here'
          />
          {/* Dates */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {/* Start Date */}
            <ProfileInputField
              label='Start Date'
              name='startDate'
              value={experience.startDate}
              type='month-year'
              isEditing={true}
              onChange={(name, value) =>
                handleWorkExperienceChange(index, name, value)
              }
              icon={<Calendar size={16} />}
            />
            {/* End Date */}
            <ProfileInputField
              label='End Date'
              name='endDate'
              value={experience.endDate}
              type='month-year'
              isEditing={true}
              onChange={(name, value) =>
                handleWorkExperienceChange(index, name, value)
              }
              icon={<Calendar size={16} />}
              disabled={isOngoing}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className='mb-8 rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md'>
      <div className='mb-4 flex justify-between'>
        <h2 className='flex items-center self-center text-xl font-semibold text-gray-800'>
          <Briefcase className='mr-2' /> Work Experience
        </h2>
        {!editModes.editWorkExperience ? (
          <EditButton
            editModeKey='editWorkExperience'
            updateEditModes={updateEditModes}
            checkEditModes={checkEditModes}
          />
        ) : null}
      </div>

      <div>
        {editModes.editWorkExperience ? (
          <div>
            {/* All Work Experiences */}
            {workExperiences.map((experience, index) =>
              renderWorkExperienceForm(experience, index)
            )}

            {/* Add New Experience Button */}
            <Button
              className='mb-4 hover:bg-gray-100'
              onClick={addNewWorkExperience}
              variant='outline'
              size='sm'
              icon={<Plus size={18} />}
            >
              Add Work Experience
            </Button>

            {/* Save Button */}
            <div className='mt-4'>
              <SaveButton
                editModeKey='editWorkExperience'
                handleSave={handleWorkExperienceSave}
              />
            </div>
          </div>
        ) : (
          <div>
            {workExperiences && workExperiences.length > 0 ? (
              <div className='space-y-4'>
                {workExperiences.map((experience, index) => (
                  <WorkExperienceCard
                    key={experience.id || index}
                    experience={experience}
                  />
                ))}
              </div>
            ) : (
              <p className='italic text-gray-500'>
                No work experience added yet.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export const WorkExperienceCard = ({
  experience,
}: {
  experience: WorkExperience;
}) => {
  const formatDateRange = () => {
    const formatDateObject = (date: Date) => {
      return date.toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      });
    };

    const startDateStr = experience.startDate
      ? formatDateObject(new Date(experience.startDate))
      : '';

    if (!experience.endDate) {
      return startDateStr ? `${startDateStr} - Present` : '';
    } else {
      const endDateStr = formatDateObject(new Date(experience.endDate));
      return startDateStr && endDateStr
        ? `${startDateStr} - ${endDateStr}`
        : startDateStr || endDateStr;
    }
  };

  const dateRange = formatDateRange();

  return (
    <div
      className={`rounded-2xl border border-gray-200 p-8 transition-shadow hover:shadow-sm`}
    >
      {/* Work Experience Header */}
      <div className='flex items-start justify-between'>
        <div className='space-y-1'>
          <h4 className='text-lg font-semibold text-gray-800'>
            {experience.role || 'Untitled Position'}
          </h4>
          <div className='text-md text-gray-600'>
            {experience.companyName || 'Unknown Company'}
          </div>
          {dateRange && (
            <div className='flex items-center text-sm text-gray-500'>
              <span>{dateRange}</span>
            </div>
          )}
        </div>
      </div>

      {/* Work Description */}
      {experience.description && (
        <div className='mt-4'>
          <p className='text-gray-600'>{experience.description}</p>
        </div>
      )}
    </div>
  );
};

export default WorkExperienceSection;
