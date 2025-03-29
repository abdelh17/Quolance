import React, { useEffect, useState } from 'react';
import { Globe, X } from 'lucide-react';
import {
  EditModesType,
  FreelancerProfileType,
} from '@/models/user/UserResponse';
import EditButton from './EditButton';
import SaveButton from './SaveButton';
import CustomListbox, { ListboxItem } from '@/components/ui/ComboListBox';

interface LanguageSectionProps {
  profile: FreelancerProfileType;
  handleInputChange: (field: keyof FreelancerProfileType, value: any) => void;
  updateEditModes: (value: string) => void;
  editModes: EditModesType;
  handleSave: (value: string) => void;
  checkEditModes: (value: string) => boolean;
}

// Common languages list
const LANGUAGES: ListboxItem[] = [
  { id: '1', value: 'ENGLISH', label: 'English' },
  { id: '2', value: 'SPANISH', label: 'Spanish' },
  { id: '3', value: 'FRENCH', label: 'French' },
  { id: '4', value: 'GERMAN', label: 'German' },
  { id: '5', value: 'CHINESE', label: 'Chinese' },
  { id: '6', value: 'JAPANESE', label: 'Japanese' },
  { id: '7', value: 'RUSSIAN', label: 'Russian' },
  { id: '8', value: 'PORTUGUESE', label: 'Portuguese' },
  { id: '9', value: 'HINDI', label: 'Hindi' },
  { id: '10', value: 'ARABIC', label: 'Arabic' },
  { id: '11', value: 'ITALIAN', label: 'Italian' },
  { id: '12', value: 'DUTCH', label: 'Dutch' },
  { id: '13', value: 'KOREAN', label: 'Korean' },
  { id: '14', value: 'TURKISH', label: 'Turkish' },
  { id: '15', value: 'SWEDISH', label: 'Swedish' },
  { id: '16', value: 'POLISH', label: 'Polish' },
  { id: '17', value: 'VIETNAMESE', label: 'Vietnamese' },
  { id: '18', value: 'THAI', label: 'Thai' },
  { id: '19', value: 'GREEK', label: 'Greek' },
  { id: '20', value: 'HEBREW', label: 'Hebrew' },
];

const LanguageSection: React.FC<LanguageSectionProps> = ({
  profile,
  handleInputChange,
  updateEditModes,
  editModes,
  handleSave,
  checkEditModes,
}) => {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    profile.languagesSpoken || []
  );

  useEffect(() => {
    setSelectedLanguages(profile.languagesSpoken || []);
  }, [profile.languagesSpoken]);

  const handleLanguageChange = (selected: string | string[]) => {
    if (Array.isArray(selected)) {
      setSelectedLanguages(selected);
      handleInputChange('languagesSpoken', selected);
    }
  };

  const handleRemoveLanguage = (languageToRemove: string) => {
    const updatedLanguages = selectedLanguages.filter(
      (lang) => lang !== languageToRemove
    );
    setSelectedLanguages(updatedLanguages);
    handleInputChange('languagesSpoken', updatedLanguages);
  };

  const getLanguageLabel = (value: string) => {
    const language = LANGUAGES.find((lang) => lang.value === value);
    return language?.label || value;
  };

  const handleLanguageSave = (editModeKey: string) => {
    handleSave(editModeKey);
  };

  return (
    <section className='mb-8 rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md'>
      <div className='mb-4 flex justify-between'>
        <h2 className='flex items-center self-center text-xl font-semibold text-gray-800'>
          <Globe className='mr-2' /> Languages
        </h2>
        {!editModes.editLanguages ? (
          <EditButton
            editModeKey='editLanguages'
            updateEditModes={updateEditModes}
            checkEditModes={checkEditModes}
          />
        ) : null}
      </div>

      <div>
        {editModes.editLanguages ? (
          <div className='space-y-4'>
            {/* Display selected languages as badges */}
            {selectedLanguages.length > 0 && (
              <div className='mb-3 flex flex-wrap gap-2'>
                {selectedLanguages.map((languageValue) => (
                  <div
                    key={languageValue}
                    className='flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-sm text-blue-700'
                  >
                    <span>{getLanguageLabel(languageValue)}</span>
                    <button
                      onClick={() => handleRemoveLanguage(languageValue)}
                      className='ml-1.5 rounded-full p-0.5 text-blue-700 hover:bg-blue-100'
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Language selection dropdown */}
            <div>
              <CustomListbox
                items={LANGUAGES}
                name='languages'
                multiple={true}
                value={selectedLanguages}
                onChange={handleLanguageChange}
                placeholder='Select languages you speak...'
                className='w-full'
              />
              <p className='mt-1 text-xs text-gray-500'>
                Select multiple languages from the dropdown
              </p>
            </div>

            {/* Save Button */}
            <div className='mt-6'>
              <SaveButton
                editModeKey='editLanguages'
                handleSave={handleLanguageSave}
              />
            </div>
          </div>
        ) : (
          <div>
            {selectedLanguages && selectedLanguages.length > 0 ? (
              <div className='flex flex-wrap gap-2'>
                {selectedLanguages.map((languageValue) => (
                  <div
                    key={languageValue}
                    className='rounded-full bg-slate-100 px-3 py-1.5 text-sm text-gray-700'
                  >
                    {getLanguageLabel(languageValue)}
                  </div>
                ))}
              </div>
            ) : (
              <p className='italic text-gray-500'>No languages added yet.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default LanguageSection;
