import React, { useState } from 'react';
import { Wrench } from 'lucide-react';
import { EditModesType } from '@/constants/models/user/UserResponse';
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
        <h2 className='self-center text-xl font-semibold text-gray-800'>
          Skills
        </h2>
        {!editModes.editSkills && (
          <EditButton
            editModeKey='editSkills'
            updateEditModes={updateEditModes}
            checkEditModes={checkEditModes}
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
                  className={`rounded-lg px-4 py-2 text-xs transition-all duration-200 ${
                    profile.skills.includes(skill.value)
                      ? 'rounded-full bg-indigo-100 px-5 text-base font-semibold text-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {skill.label}
                </button>
              ))}
            </div>
          </div>
          <div className='mt-4'>
            <SaveButton editModeKey='editSkills' handleSave={handleSave} />
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
                  className='rounded-full bg-orange-50 px-7 py-3.5 text-base font-semibold leading-7 text-gray-700'
                >
                  {skill?.label || skillValue}
                </span>
              );
            })
          ) : (
            <div className='flex items-center'>
              <Wrench className=' mr-3' />
              <span className='text-gray-700'>Not specified</span>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default SkillsSection;
