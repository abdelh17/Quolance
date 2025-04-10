import React from 'react';
import { Briefcase } from 'lucide-react';
import {
  FreelancerProfileType,
  EditModesType,
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
      <h2 className='flex items-center self-center text-md sm:text-xl font-semibold text-gray-80'>
        <Briefcase className=' mr-2' />  Experience Level
      </h2>
      {!editModes.editExperience ? (
        <EditButton
          editModeKey='editExperience'
          updateEditModes={updateEditModes}
          checkEditModes={checkEditModes}
          dataTest="profile-experience-edit-btn"
        />
      ) : null}
    </div>
    <div className=''>
      {editModes.editExperience ? (
        <div>
          <div className='flex'>
            <ExperienceLevelRadioGroup
              name='experienceLevel'
              value={profile.experienceLevel ?? ''}
              onChange={(e) =>
                handleInputChange('experienceLevel', e.target.value)
              }
            />
          </div>
          <div className='mt-4'>
            <SaveButton editModeKey='editExperience' handleSave={handleSave} dataTest="profile-experience-save-btn" />
          </div>
        </div>
      ) : (
        <p
          className={
            profile.experienceLevel
              ? 'capitalize text-gray-700'
              : 'italic text-gray-500'
          }
        >
          {profile.experienceLevel?.toLowerCase() ?? 'No experience level added.'}
        </p>
      )}
    </div>
  </section>
);


export default ExperienceSection;

