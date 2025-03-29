import React from 'react';
import { Briefcase } from 'lucide-react';
import {
  EditModesType,
  FreelancerProfileType,
} from '@/models/user/UserResponse';
import { ExperienceLevelRadioGroup } from '@/components/ui/freelancers/FreelancerProfileRadioGroups';
import EditButton from './EditButton';
import SaveButton from './SaveButton';

interface ExperienceSectionProps {
  profile: {
    experienceLevel?: string | null;
  };
  handleInputChange: (
    field: keyof FreelancerProfileType,
    value: string
  ) => void;
  updateEditModes: (value: string) => void;
  editModes: EditModesType;
  handleSave: (value: string) => void;
  checkEditModes: (value: string) => boolean;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  profile,
  handleInputChange,
  updateEditModes,
  editModes,
  handleSave,
  checkEditModes,
}) => (
  <section className='mb-8 rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md'>
    <div className='mb-4 flex justify-between'>
      <h2 className='self-center text-xl font-semibold text-gray-800'>
        Experience
      </h2>
      {!editModes.editExperience ? (
        <EditButton
          editModeKey='editExperience'
          updateEditModes={updateEditModes}
          checkEditModes={checkEditModes}
        />
      ) : null}
    </div>
    <div className=''>
      {editModes.editExperience ? (
        <div>
          <div className='flex'>
            <Briefcase className=' mr-3' />
            <ExperienceLevelRadioGroup
              name='experienceLevel'
              value={profile.experienceLevel ?? ''}
              onChange={(e) =>
                handleInputChange('experienceLevel', e.target.value)
              }
            />
          </div>
          <div className='mt-4'>
            <SaveButton editModeKey='editExperience' handleSave={handleSave} />
          </div>
        </div>
      ) : (
        <div className='flex items-center'>
          <Briefcase className=' mr-3' />
          <span className='capitalize text-gray-700'>
            {profile.experienceLevel?.toLowerCase() ?? 'Not specified'}
          </span>
        </div>
      )}
    </div>
  </section>
);

export default ExperienceSection;
