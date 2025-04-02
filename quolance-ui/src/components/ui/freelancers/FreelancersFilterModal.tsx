import React, { SetStateAction } from 'react';
import { PiX } from 'react-icons/pi';
import { ApplicationFilters } from '@/app/(with-main-layout)/projects/[id]/ProjectSubmissions';
import CustomListbox from '@/components/ui/ComboListBox';
import { SKILLS_OPTIONS } from '@/constants/types/form-types';
import { formatEnumString } from '@/util/stringUtils';

function FreelancersFilterModal({
  filterModal,
  setFilterModal,
  filters,
  onFilterChange,
  onApplyFilters,
  onResetFilters,
  filteredResults,
}: {
  filterModal: boolean;
  setFilterModal: React.Dispatch<SetStateAction<boolean>>;
  filters: ApplicationFilters;
  onFilterChange: <K extends keyof ApplicationFilters>(
    filterType: K,
    value: ApplicationFilters[K]
  ) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  filteredResults: number;
}) {
  return (
    <>
      <section
        className={`fixed left-0 right-0 top-0 z-[999] flex h-auto items-center justify-center overflow-y-auto delay-[30ms] duration-700 ease-out ${
          filterModal
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0'
        }`}
      >
        <div className='mx-3 mb-24 mt-14 max-h-[85vh] min-w-[500px] max-w-[1175px] overflow-y-auto rounded-2xl bg-white p-8 drop-shadow-2xl'>
          <div className='flex items-center justify-between gap-3'>
            <p className='text-xl font-medium'>All filters</p>
            <button onClick={() => setFilterModal(false)}>
              <PiX className='text-2xl' />
            </button>
          </div>
          <div className='border-n30 flex w-full flex-col items-start justify-start gap-4 border-b py-6 sm:flex-row sm:items-center'>
            <div className='flex items-center gap-3'>
              <label className='inline-flex cursor-pointer items-center'>
                <input
                  type='checkbox'
                  checked={filters.viewRejected}
                  onChange={(e) =>
                    onFilterChange('viewRejected', e.target.checked)
                  }
                  className='peer sr-only'
                />
                <span className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800" />
              </label>
              <p className='text-n300 text-xs sm:text-lg'>
                View Rejected Submissions
              </p>
            </div>
          </div>

          <div className='border-n30 border-b py-6'>
            <p className='text-sm font-medium sm:text-xl '>Skills</p>
            <CustomListbox
              className={'mt-3'}
              innerClassName={'!rounded-2xl !px-4 !py-3'}
              items={SKILLS_OPTIONS}
              name={'skills'}
              multiple={true}
              value={filters.skills}
              onChange={(value) => {
                if (Array.isArray(value)) {
                  return onFilterChange('skills', value);
                }
              }}
            />
            {filters.skills.length > 0 && (
              <div className='flex max-w-[320px] flex-wrap items-center justify-start gap-3 pt-3'>
                {filters.skills.map((skill, index) => (
                  <p
                    key={index}
                    className='border-n30 rounded-2xl border px-4 py-2'
                  >
                    {formatEnumString(skill)}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className='border-n30 border-b py-6'>
            <p className='pb-3 text-sm font-medium sm:text-xl'>
              Expertise Level
            </p>
            <div className='text-n300 flex flex-wrap items-center justify-start gap-3 text-xs sm:text-sm'>
              {['Junior', 'Intermediate', 'Expert'].map((level) => (
                <p
                  key={level}
                  className={`border-n30 hover:border-n50 cursor-pointer rounded-2xl border px-4 py-2 duration-300 
                    ${
                      filters.experienceLevel === level
                        ? 'text-n900 bg-n20 hover:bg-n30'
                        : 'hover:bg-n20'
                    }
                  `}
                  onClick={() => onFilterChange('experienceLevel', level)}
                >
                  {level}
                </p>
              ))}
            </div>
          </div>

          <div className='border-n30 flex items-center justify-between gap-6 border-b py-6 max-md:flex-col'>
            <div className='w-full'>
              <p className='pb-3 text-sm font-medium sm:text-xl'>Name</p>
              <div className='border-n30 text-n300 flex items-center justify-between rounded-xl border px-3 py-2'>
                <input
                  type='text'
                  placeholder='Search name here...'
                  value={filters.name || ''}
                  className='w-full bg-transparent outline-none'
                  onChange={(e) => onFilterChange('name', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className='flex items-end justify-end gap-4 pt-6 '>
            <button
              className=' bg-n30 hover:text-n900 relative flex items-center justify-center overflow-hidden rounded-full px-4 py-2 text-xs font-medium duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)] sm:text-base lg:px-8 lg:py-3'
              onClick={onResetFilters}
            >
              <span className=' relative z-10'>Clear Filters</span>
            </button>
            <button
              onClick={onApplyFilters}
              className=' bg-b300 hover:text-n900 relative flex items-center justify-center overflow-hidden rounded-full px-4 py-2 text-xs font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)] sm:text-base lg:px-8 lg:py-3'
            >
              <span className='relative z-10'>{`View ${filteredResults} result${
                filteredResults > 1 ? 's' : ''
              }`}</span>
            </button>
          </div>
        </div>
      </section>

      <div
        className={`bg-b50/60 fixed inset-0 z-[998] duration-700 ${
          filterModal ? 'translate-y-0 opacity-100' : 'translate-y-full'
        }`}
      ></div>
    </>
  );
}

export default FreelancersFilterModal;
