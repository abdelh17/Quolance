import { PiCaretLeft, PiCaretRight } from 'react-icons/pi';
import { PageMetaData } from '@/constants/types/pagination-types';

interface PaginationProps {
  metadata: PageMetaData;
  onPageChange: (pageNumber: number) => void;
}

function Pagination({ metadata, onPageChange }: PaginationProps) {
  if (!metadata || metadata.totalElements === 0) return null;
  const { pageNumber, totalPages, first, last } = metadata;

  // Convert 0-based pageNumber to 1-based for display
  const currentPage = pageNumber + 1;

  const getPageNumbers = () => {
    const delta = 2;
    const range: (number | string)[] = [];
    
    // Handle case with few pages
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always include first page
    range.push(1);
    
    // Calculate start and end of the current window
    const startPage = Math.max(2, currentPage - delta);
    const endPage = Math.min(totalPages - 1, currentPage + delta);
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      range.push('...');
    }
    
    // Add pages in the current window
    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      range.push('...');
    }
    
    // Always include last page
    if (totalPages > 1) {
      range.push(totalPages);
    }
    
    return range;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col items-center gap-4">
      <ul className="flex items-center justify-center gap-2 font-medium text-white sm:gap-3">
        {/* Left arrow */}
        <li
          className={`bg-n900 hover:bg-b300 flex cursor-pointer items-center justify-center rounded-full p-3 text-xl duration-500 ${
            first ? 'cursor-not-allowed opacity-50' : ''
          }`}
          onClick={() => !first && onPageChange(pageNumber - 1)}
          aria-disabled={first}
          role="button"
          aria-label="Previous page"
        >
          <PiCaretLeft className="h-5 w-5" />
        </li>

        {/* Page numbers */}
        {pageNumbers.map((number, index) => (
          <li
            key={`${number}-${index}`}
            className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-full 
              ${number === currentPage ? 'bg-b300' : 'bg-n900'}
              ${number === '...' ? 'cursor-default' : 'hover:bg-b300'}
              duration-500`}
            onClick={() => 
              typeof number === 'number' && onPageChange(number - 1) // Convert 1-based UI to 0-based index
            }
            role={typeof number === 'number' ? 'button' : 'presentation'}
            aria-current={number === currentPage ? 'page' : undefined}
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
          role="button"
          aria-label="Next page"
        >
          <PiCaretRight className="h-5 w-5" />
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
  
  const startItem = totalElements > 0 ? pageNumber * pageSize + 1 : 0;
  const endItem = Math.min((pageNumber + 1) * pageSize, totalElements);

  return (
    <p data-test="pagination" className="text-sm text-gray-700">
      Showing{' '}
      <span className="font-medium">{startItem}</span>
      {' '}to{' '}
      <span className="font-medium">{endItem}</span>
      {' '}of{' '}
      <span className="font-medium">{totalElements}</span> results
    </p>
  );
};

export default Pagination;