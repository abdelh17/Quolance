import React, { useState } from 'react';
import { FreelancerProfileType } from '@/constants/models/user/UserResponse';
import SaveButton from './SaveButton';
import { X } from 'lucide-react';

interface UpdateProfileModalProps {
  profile: FreelancerProfileType;
  inputClassName: string;
  availableSkills: Array<{ id: string; value: string; label: string }>;
  saveEditModes: (value: string) => void;
  handleInputChange: (
    field: keyof FreelancerProfileType,
    value: string
  ) => void;
  handleSkillsChange: (skills: string) => void;
  handleSocialLinksChange: (links: string) => void;
  handleSave: (value: string) => void;
}

export const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({
  profile,
  inputClassName,
  availableSkills,
  saveEditModes,
  handleInputChange,
  handleSkillsChange,
  handleSocialLinksChange,
  handleSave,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSkillClick = (skillValue: string) => {
    const currentSkills = new Set(profile.skills);
    currentSkills.has(skillValue)
      ? currentSkills.delete(skillValue)
      : currentSkills.add(skillValue);
    handleSkillsChange(Array.from(currentSkills).join(','));
  };

  const filteredSkills = availableSkills.filter(
    (skill) =>
      skill.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClose = () => {
    saveEditModes('editProfile');
  };

  return (
    <dialog
      className='relative z-10'
      aria-labelledby='modal-title'
      open
      aria-modal='true'
    >
      <div
        className='fixed inset-0 bg-gray-500/75 transition-opacity'
        aria-hidden='true'
      ></div>
      <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
        <div
          className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'
          style={{ marginTop: '-75px' }}
        >
          <div className='relative w-full max-w-3xl transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8'>
            <div className='bg-white'>
              <div className='flex items-center justify-between border-b border-gray-200 p-3'>
                <h2 className='text-lg font-bold'>Edit Profile</h2>
                <button
                  className='flex h-10 w-10 items-center justify-center rounded-3xl hover:bg-gray-100'
                  onClick={handleClose}
                >
                  <X className='' />
                </button>
              </div>
              <div className='sm:flex sm:items-start sm:justify-between'>
                <div className='flex h-[500px] w-full flex-col gap-6 overflow-y-auto p-10'>
                  {/* All existing form fields remain unchanged */}
                  <div>
                    <label className='text-sm text-gray-500'>First Name</label>
                    <input
                      type='text'
                      value={profile.firstName}
                      onChange={(e) =>
                        handleInputChange('firstName', e.target.value)
                      }
                      className={`text-sm placeholder:text-sm ${inputClassName}`}
                      placeholder='Enter First Name'
                    />
                  </div>

                  {/* Other form fields... */}

                  <div>
                    <label className='text-sm text-gray-500'>Skills</label>
                    <div className='space-y-4'>
                      <input
                        type='text'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`text-sm placeholder:text-sm ${inputClassName}`}
                        placeholder='Search skills...'
                      />
                      <div className='flex flex-wrap gap-2'>
                        {filteredSkills.map((skill) => (
                          <button
                            key={skill.id}
                            onClick={() => handleSkillClick(skill.value)}
                            className={`rounded-lg px-4 py-2 text-xs transition-all duration-200 ${
                              profile.skills.includes(skill.value)
                                ? 'py-3.5 px-7 rounded-full bg-orange-50 font-semibold text-base leading-7 text-gray-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {skill.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Remaining form fields... */}
                  <div>
                    <label className='text-sm text-gray-500'>
                      Contact Email
                    </label>
                    <input
                      type='email'
                      value={profile.contactEmail ?? ''}
                      placeholder='Enter Contact Email'
                      onChange={(e) =>
                        handleInputChange('contactEmail', e.target.value)
                      }
                      className={`text-sm placeholder:text-sm ${inputClassName}`}
                    />
                  </div>

                  <div>
                    <label className='text-sm text-gray-500'>
                      Social Media
                    </label>
                    <input
                      type='text'
                      value={profile.socialMediaLinks.join(', ')}
                      onChange={(e) => handleSocialLinksChange(e.target.value)}
                      className={`text-sm placeholder:text-sm ${inputClassName}`}
                      placeholder='Enter Social Media Links Separated By Commas'
                    />
                  </div>
                </div>
              </div>
              <div className='flex items-center justify-end border-t border-gray-200 p-4'>
                <SaveButton editModeKey='editProfile' handleSave={handleSave} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};
