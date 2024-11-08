import { PiCaretLeft, PiCaretRight } from "react-icons/pi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <ul className="flex items-center justify-center gap-2 font-medium text-white sm:gap-3">
      {/* Left arrow */}
      <li
        className={`flex cursor-pointer items-center justify-center rounded-full bg-n900 p-[14px] text-xl duration-500 hover:bg-b300 ${
          currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <PiCaretLeft />
      </li>

     
      {pageNumbers.map((pageNumber) => (
        <li
          key={pageNumber}
          className={`flex size-12 cursor-pointer items-center justify-center rounded-full ${
            pageNumber === currentPage ? "bg-b300" : "bg-n900"
          } duration-500 hover:bg-b300`}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </li>
      ))}

     
      <li
        className={`flex cursor-pointer items-center justify-center rounded-full bg-n900 p-[14px] text-xl duration-500 hover:bg-b300 ${
          currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <PiCaretRight />
      </li>
    </ul>
  );
}

export default Pagination;