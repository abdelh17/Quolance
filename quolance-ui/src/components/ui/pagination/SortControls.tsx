'use client';
import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react';
import CustomListbox, { ListboxItem } from '@/components/ui/ComboListBox';
import { PageInfoResults } from '@/components/ui/Pagination';
import { PageMetaData } from '@/constants/types/pagination-types';

interface SortControlsProps<T> {
  query: T;
  setQuery: (query: T) => void;
  sortOptions: Array<{
    value: string;
    label: string;
  }>;
  metadata: PageMetaData;
}

const PAGE_SIZE_OPTIONS = [
  { id: 1, value: '10', label: '10 per page' },
  { id: 2, value: '20', label: '20 per page' },
  { id: 3, value: '50', label: '50 per page' },
];

function SortControls<
  T extends { sortBy?: string; sortDirection?: string; size?: number }
>({ query, setQuery, sortOptions, metadata }: SortControlsProps<T>) {
  const toggleSortDirection = () => {
    setQuery({
      ...query,
      sortDirection: query.sortDirection === 'ASC' ? 'DESC' : 'ASC',
    });
  };

  const convertSortOptionsToListBoxItems = (
    sortOptions: Array<{ value: string; label: string }>
  ): ListboxItem[] => {
    return sortOptions.map((option) => ({
      id: option.value,
      label: option.label,
      value: option.value,
    }));
  };

  return (
    <div className={'flex flex-row items-center justify-between'}>
      <PageInfoResults metadata={metadata} />
      <div className='flex w-[380px] items-center gap-4 rounded-lg bg-white py-3'>
        <div className='flex-1'>
          <CustomListbox
            items={convertSortOptionsToListBoxItems(sortOptions)}
            name='sortBy'
            value={query.sortBy || ''}
            onChange={(value) =>
              setQuery({ ...query, sortBy: value as string })
            }
            placeholder='Sort by...'
            className='!mt-0 min-w-[160px]'
          />
        </div>

        <button
          onClick={toggleSortDirection}
          className='m-0 flex items-center justify-center p-0'
          aria-label='Toggle sort direction'
        >
          {query.sortDirection === 'ASC' ? (
            <ArrowUpAZ className='h-4 w-4' />
          ) : (
            <ArrowDownAZ className='h-4 w-4' />
          )}
        </button>

        <div className='w-[140px]'>
          <CustomListbox
            items={PAGE_SIZE_OPTIONS}
            name='size'
            value={String(query.size || '10')}
            onChange={(value) => setQuery({ ...query, size: Number(value) })}
            placeholder='Items per page'
            className='!mt-0'
          />
        </div>
      </div>
    </div>
  );
}

export default SortControls;
