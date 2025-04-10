import React, { useState } from 'react';
import { EditModesType } from '@/models/user/UserResponse';
import EditButton from './EditButton';
import SaveButton from './SaveButton';


interface SkillsSectionProps {
  profile: {
    skills: string[];
  };
  handleSkillsChange: (skills: string) => void;
  inputClassName: string;
  availableSkills: Array<{ id: string; value: string; label: string }>;
  updateEditModes: (value: string) => void;
  editModes: EditModesType;
  handleSave: (value: string) => void;
  checkEditModes: (value: string) => boolean;
}


const SkillsSection: React.FC<SkillsSectionProps> = ({
  profile,
  handleSkillsChange,
  inputClassName,
  availableSkills,
  updateEditModes,
  editModes,
  handleSave,
  checkEditModes,
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


  return (
    <section className='mb-8 rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md'>
      <div className='mb-4 flex justify-between'>
        <h2 className='self-center text-md sm:text-xl font-semibold text-gray-800'>
          Skills
        </h2>
        {!editModes.editSkills && (
          <EditButton
            editModeKey='editSkills'
            updateEditModes={updateEditModes}
            checkEditModes={checkEditModes}
            dataTest="profile-skills-edit-btn"
          />
        )}
      </div>
      {editModes.editSkills ? (
        <div>
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
                  className={`
                w-20 lg:w-32
                h-10
                text-xs truncate text-center
                rounded-full transition-all duration-200
                ${profile.skills.includes(skill.value)
                      ? 'bg-indigo-100 font-semibold text-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
              `}
                >
                  {skill.label}
                </button>

              ))}
            </div>
          </div>
          <div className='mt-4'>
            <SaveButton editModeKey='editSkills' handleSave={handleSave} dataTest="profile-skills-save-btn" />
          </div>
        </div>
      ) : (
        <div className='flex flex-wrap gap-2'>
          {profile.skills.length > 0 ? (
            profile.skills.map((skillValue) => {
              const skill = availableSkills.find((s) => s.value === skillValue);
              return (
                <span
                  key={skillValue}
                  className={`
                   w-20 lg:w-32
                   h-10
                   inline-flex items-center justify-center
                   text-xs truncate text-center
                   rounded-full bg-slate-100 text-gray-700 font-medium
                 `}
                >
                  {skill?.label || skillValue}
                </span>


              );
            })
          ) : (
            <p className='italic text-gray-500'>No skills added yet.</p>
          )}
        </div>
      )}
    </section>
  );
};


export default SkillsSection;
