import { PiCaretLeft, PiCaretRight } from 'react-icons/pi';
import { PageMetaData } from '@/constants/types/pagination-types';

interface PaginationProps {
  metadata: PageMetaData;
  onPageChange: (pageNumber: number) => void;
}

function Pagination({ metadata, onPageChange }: PaginationProps) {
  if (!metadata) return null;
  const { pageNumber, totalPages, first, last } = metadata;

  const getPageNumbers = () => {
    const delta = 2;
    const range: (number | string)[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // First page
        i === totalPages || // Last page
        (i >= pageNumber - delta && i <= pageNumber + delta)
      ) {
        range.push(i);
      } else if (i === 2 || i === totalPages - 1) {
        range.push('...');
      }
    }

    // Remove duplicate ellipsis
    return range.filter(
      (item, index, array) => item !== '...' || array[index - 1] !== '...'
    );
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className='flex flex-col items-center gap-4'>
      <ul className='flex items-center justify-center gap-2 font-medium text-white sm:gap-3'>
        {/* Left arrow */}
        <li
          className={`bg-n900 hover:bg-b300 flex cursor-pointer items-center justify-center rounded-full p-3 text-xl duration-500 ${
            first ? 'cursor-not-allowed opacity-50' : ''
          }`}
          onClick={() => !first && onPageChange(pageNumber - 1)}
          aria-disabled={first}
          role='button'
          aria-label='Previous page'
        >
          <PiCaretLeft className='h-5 w-5' />
        </li>

        {/* Page numbers */}
        {pageNumbers.map((number, index) => (
          <li
            key={`${number}-${index}`}
            className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-full 
              ${number === pageNumber ? 'bg-b300' : 'bg-n900'}
              ${number === '...' ? 'cursor-default' : 'hover:bg-b300'}
              duration-500`}
            onClick={() => typeof number === 'number' && onPageChange(number)}
            role={typeof number === 'number' ? 'button' : 'presentation'}
            aria-current={number === pageNumber ? 'page' : undefined}
          >
            {number}
          </li>
        ))}

        {/* Right arrow */}
        <li
          className={`bg-n900 hover:bg-b300 flex cursor-pointer items-center justify-center rounded-full p-3 text-xl duration-500 ${
            last ? 'cursor-not-allowed opacity-50' : ''
          }`}
          onClick={() => !last && onPageChange(pageNumber + 1)}
          aria-disabled={last}
          role='button'
          aria-label='Next page'
        >
          <PiCaretRight className='h-5 w-5' />
        </li>
      </ul>

      {/* Page info */}
      <PageInfoResults metadata={metadata} />
    </div>
  );
}

export const PageInfoResults = ({ metadata }: { metadata: PageMetaData }) => {
  if (!metadata) return null;
  const { pageNumber, totalElements, pageSize } = metadata;

  return (
    <p className='text-sm text-gray-700'>
      Showing{' '}
      <span className='font-medium'>
        {totalElements > 0 ? pageNumber * pageSize + 1 : 0}
      </span>{' '}
      to{' '}
      <span className='font-medium'>
        {Math.min((pageNumber + 1) * pageSize, totalElements)}
      </span>{' '}
      of <span className='font-medium'>{totalElements}</span> results
    </p>
  );
};

export default Pagination;
