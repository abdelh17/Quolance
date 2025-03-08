import React, { useState } from 'react';
import { ProjectFilterQuery } from '@/api/projects-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import {
  BUDGET_OPTIONS,
  BUSINESS_CATEGORY_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
} from '@/constants/types/form-types';
import CustomListbox from '@/components/ui/ComboListBox';
import { PaginationQueryDefault } from '@/constants/types/pagination-types';

interface ProjectFilterProps {
  query: ProjectFilterQuery;
  setQuery: (query: ProjectFilterQuery) => void;
}

const defaultQuery: ProjectFilterQuery = {
  ...PaginationQueryDefault,
  searchTitle: '',
  category: '',
  priceRange: '',
  experienceLevel: '',
};

function ProjectFilter({ query, setQuery }: ProjectFilterProps) {
  const [localQuery, setLocalQuery] = useState<ProjectFilterQuery>({
    ...defaultQuery,
    ...query,
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery((prev) => ({ ...prev, searchTitle: e.target.value }));
  };

  const handleApplyFilters = () => {
    setQuery(localQuery);
  };

  const handleResetFilters = () => {
    setLocalQuery(defaultQuery);
    setQuery(defaultQuery);
  };

  return (
    <div className='w-full space-y-6 rounded-lg bg-white p-6'>
      <div className='space-y-4'>
        {/* Title Search */}
        <div>
          <label data-test="project-filter-label-title" className='mb-1 block text-sm font-medium text-gray-700'>
            Search by title
          </label>
          <div className='relative'>
            <Input
              data-test="project-filter-input-title"
              type='text'
              placeholder='Type to search...'
              value={localQuery.searchTitle || ''}
              onChange={handleTitleChange}
              className='w-full'
            />
            {localQuery.searchTitle && (
              <button
                onClick={() =>
                  setLocalQuery((prev) => ({ ...prev, searchTitle: '' }))
                }
                className='absolute right-2 top-1/2 -translate-y-1/2'
              >
                <X className='h-4 w-4 text-gray-400' />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label data-test="project-filter-label-category" className='mb-1 block text-sm font-medium text-gray-700'>
            Category
          </label>
          <CustomListbox
            items={BUSINESS_CATEGORY_OPTIONS}
            name='category'
            value={localQuery.category || ''}
            onChange={(value) =>
              setLocalQuery((prev) => ({
                ...prev,
                category: (value as string) || '',
              }))
            }
            placeholder='Select category'
          />
        </div>

        {/* Budget Filter */}
        <div>
          <label  data-test="project-filter-label-budget" className='mb-1 block text-sm font-medium text-gray-700'>
            Budget
          </label>
          <CustomListbox
            items={BUDGET_OPTIONS}
            name='priceRange'
            value={localQuery.priceRange || ''}
            onChange={(value) =>
              setLocalQuery((prev) => ({
                ...prev,
                priceRange: (value as string) || '',
              }))
            }
            placeholder='Select budget'
          />
        </div>

        {/* Experience Level Filter */}
        <div>
          <label  data-test="project-filter-label-experience" className='mb-1 block text-sm font-medium text-gray-700'>
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
      </div>

      {/* Action Buttons */}
      <div className='space-y-2'>
        <Button
          data-test="apply-filters-btn"
          onClick={handleApplyFilters}
          className='relative z-0 w-full bg-blue-600 text-white hover:bg-blue-700'
          animation={'default'}
        >
          Apply Filters
        </Button>
        <Button
          data-test="reset-filters-btn"
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

export default ProjectFilter;
