import React from 'react';
import { Book } from 'lucide-react';
import {
  EditModesType,
  FreelancerProfileType,
} from '@/models/user/UserResponse';
import EditButton from './EditButton';
import SaveButton from './SaveButton';

interface AboutSectionProps {
  profile: {
    bio: string;
  };
  handleInputChange: (
    field: keyof FreelancerProfileType,
    value: string
  ) => void;
  inputClassName: string;
  updateEditModes: (value: string) => void;
  editModes: EditModesType;
  handleSave: (value: string) => void;
  checkEditModes: (value: string) => boolean;
}

const AboutSection: React.FC<AboutSectionProps> = ({
  profile,
  handleInputChange,
  inputClassName,
  updateEditModes,
  editModes,
  handleSave,
  checkEditModes,
}) => {
  const maxBioLength = 2000;

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxBioLength) {
      handleInputChange('bio', text);
    }
  };

  return (
    <section className='mb-8 rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md'>
      <div className='mb-4 flex justify-between'>
        <h2 className='self-center text-xl  font-semibold text-gray-800'>
          About
        </h2>
        {!editModes.editAbout ? (
          <EditButton
            editModeKey='editAbout'
            updateEditModes={updateEditModes}
            checkEditModes={checkEditModes}
          />
        ) : null}
      </div>

      {editModes.editAbout ? (
        <div>
          <textarea
            value={profile.bio}
            placeholder='Enter Biography'
            onChange={handleBioChange}
            className={`text-sm placeholder:text-sm ${inputClassName}`}
            rows={4}
          />
          <div className='mt-2 flex justify-between'>
            <div className='text-sm text-gray-500'>
              <span
                className={
                  profile.bio.length > maxBioLength * 0.9
                    ? 'text-amber-600'
                    : ''
                }
              >
                {profile.bio.length}
              </span>
              <span>/{maxBioLength} characters</span>
            </div>
            <SaveButton editModeKey='editAbout' handleSave={handleSave} />
          </div>
        </div>
      ) : (
        <div>
          {profile.bio.length > 0 ? (
            <p className='text-gray-700'>{profile.bio}</p>
          ) : (
            <div className='flex items-center'>
              <Book className=' mr-3' />
              <p className='text-gray-700'>Not Specified</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default AboutSection;
