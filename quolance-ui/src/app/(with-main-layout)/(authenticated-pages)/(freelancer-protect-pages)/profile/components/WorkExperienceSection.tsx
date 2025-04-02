import React, { useEffect, useState } from 'react';
import { Briefcase, Calendar, Plus, Trash2 } from 'lucide-react';
import {
  EditModesType,
  FreelancerProfileType,
  WorkExperience,
} from '@/models/user/UserResponse';
import EditButton from './EditButton';
import SaveButton from './SaveButton';
import ProfileInputField from './ProfileInputField';
import { Button } from '@/components/ui/button';
import { z } from 'zod';

const WorkExperienceSchema = z
  .object({
    id: z.string().optional(),
    companyName: z
      .string()
      .min(1, 'Company Name is required')
      .max(255, 'Company Name must contain at most 255 characters'),
    role: z
      .string()
      .min(1, 'Role is required')
      .max(255, 'Role/Position must contain at most 255 characters'),
    description: z
      .string()
      .max(5000, 'Description must contain at most 5000 characters')
      .optional(),
    startDate: z.date({ required_error: 'Start date is required' }),
    endDate: z.date().optional(),
  })
  .refine((data) => !data.endDate || data.startDate < data.endDate, {
    message: 'End date must be greater than start date',
    path: ['endDate'],
  });

const WorkExperiencesArraySchema = z.array(WorkExperienceSchema);

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

  const [errors, setErrors] = useState<Record<number, Record<string, string>>>(
    {}
  );

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

    const updatedErrors: Record<number, Record<string, string>> = {};
    Object.entries(errors).forEach(([key, value]) => {
      const i = Number(key);
      if (i < index) {
        // Keep entries before the deleted one
        updatedErrors[i] = value;
      } else if (i > index) {
        // Shift down indexes after the deleted one
        updatedErrors[i - 1] = value;
      }
    });

    setWorkExperiences(updatedExperiences);
    setErrors(updatedErrors);
    handleInputChange('workExperiences', updatedExperiences);
  };

  const normalizeDates = (experiences: WorkExperience[]) => {
    return experiences.map((exp) => ({
      ...exp,
      startDate: new Date(exp.startDate),
      endDate: exp.endDate ? new Date(exp.endDate) : undefined,
    }));
  };
  const handleWorkExperienceSave = (editModeKey: string) => {
    const normalized = normalizeDates(workExperiences);
    const result = WorkExperiencesArraySchema.safeParse(normalized);

    if (!result.success) {
      const newErrors: Record<number, Record<string, string>> = {};

      result.error.errors.forEach((err) => {
        const path = err.path;
        if (path.length >= 2 && typeof path[0] === 'number') {
          const index = path[0] as number;
          const field = path[1] as string;
          if (!newErrors[index]) newErrors[index] = {};
          newErrors[index][field] = err.message;
        }
      });

      setErrors(newErrors);
      return;
    }

    setErrors({});
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
          <h4 className='truncate break-words font-medium text-gray-800'>
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
            error={errors[index]?.companyName}
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
            error={errors[index]?.role}
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
            error={errors[index]?.description}
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
              error={errors[index]?.startDate}
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
              error={errors[index]?.endDate}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className='mb-8 rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md'>
      <div className='mb-4 flex justify-between'>
        <h2 className='text-md flex items-center self-center font-semibold text-gray-800 sm:text-xl'>
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
              <p className='italic text-gray-500'>No work experience added.</p>
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
      className={`mb-4 rounded-2xl border border-gray-200 p-8 transition-shadow hover:shadow-sm`}
    >
      {/* Work Experience Header */}
      <div className='flex items-start justify-between'>
        <div className='max-w-full space-y-1'>
          <h4 className='break-words text-lg font-semibold text-gray-800'>
            {experience.role || 'Untitled Position'}
          </h4>
          <div className='text-md break-words text-gray-600'>
            {experience.companyName || 'Unknown Company'}
          </div>
          {dateRange && (
            <div className='flex items-center break-words text-xs text-gray-500'>
              <span>{dateRange}</span>
            </div>
          )}
        </div>
      </div>

      {/* Work Description */}
      {experience.description && (
        <div className='mt-8'>
          <p className='break-words text-sm text-gray-600 sm:text-base'>
            {experience.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkExperienceSection;
