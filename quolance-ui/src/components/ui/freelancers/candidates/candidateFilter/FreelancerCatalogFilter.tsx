import {
  CandidateFilterQuery,
  CandidateFilterQueryDefault,
} from '@/api/client-api';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import CustomListbox from '@/components/ui/ComboListBox';
import {
  AVAILABILITY_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  SKILLS_OPTIONS,
} from '@/constants/types/form-types';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FreelancerCatalogFilterProps {
  query: CandidateFilterQuery;
  setQuery: (query: CandidateFilterQuery) => void;
}

function FreelancerCatalogFilter({
  query,
  setQuery,
}: FreelancerCatalogFilterProps) {
  const [localQuery, setLocalQuery] = useState<CandidateFilterQuery>({
    ...CandidateFilterQueryDefault,
    ...query,
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery((prev) => ({ ...prev, searchName: e.target.value }));
  };

  const handleSkillsChange = (values: string[]) => {
    setLocalQuery((prev) => ({
      ...prev,
      skills: values,
    }));
  };

  const removeSkill = (skillToRemove: string) => {
    setLocalQuery((prev) => ({
      ...prev,
      skills: prev.skills?.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleApplyFilters = () => {
    setQuery(localQuery);
  };

  const handleResetFilters = () => {
    setLocalQuery(CandidateFilterQueryDefault);
    setQuery(CandidateFilterQueryDefault);
  };

  return (
    <div className='w-full space-y-6 rounded-lg bg-white p-6'>
      <div className='space-y-4'>
        {/* Name Search */}
        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700'>
            Search by name
          </label>
          <div className='relative'>
            <Input
              type='text'
              placeholder='Type to search...'
              value={localQuery.searchName || ''}
              onChange={handleNameChange}
              className='w-full'
            />
            {localQuery.searchName && (
              <button
                onClick={() =>
                  setLocalQuery((prev) => ({ ...prev, searchName: '' }))
                }
                className='absolute right-2 top-1/2 -translate-y-1/2'
              >
                <X className='h-4 w-4 text-gray-400' />
              </button>
            )}
          </div>
        </div>

        {/* Experience Level Filter */}
        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700'>
            Experience Level
          </label>
          <CustomListbox
            items={EXPERIENCE_LEVEL_OPTIONS}
            name='experienceLevel'
            value={localQuery.experienceLevel || ''}
            onChange={(value) =>
              setLocalQuery((prev) => ({
                ...prev,
                experienceLevel: (value as string) || '',
              }))
            }
            placeholder='Select experience level'
          />
        </div>

        {/* Availability Filter */}
        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700'>
            Availability
          </label>
          <CustomListbox
            items={AVAILABILITY_OPTIONS}
            name='availability'
            value={localQuery.availability || ''}
            onChange={(value) =>
              setLocalQuery((prev) => ({
                ...prev,
                availability: (value as string) || '',
              }))
            }
            placeholder='Select availability'
          />
        </div>

        {/* Skills Filter */}
        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700'>
            Skills
          </label>
          <CustomListbox
            items={SKILLS_OPTIONS}
            name='skills'
            value={localQuery.skills || []}
            multiple={true}
            onChange={(values) => handleSkillsChange(values as string[])}
            placeholder='Select skills'
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className='space-y-2'>
        <Button
          onClick={handleApplyFilters}
          className='relative z-0 w-full bg-blue-600 text-white hover:bg-blue-700'
          animation={'default'}
        >
          Apply Filters
        </Button>
        <Button
          onClick={handleResetFilters}
          variant='outline'
          className='relative z-0 w-full'
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
}

export default FreelancerCatalogFilter;
