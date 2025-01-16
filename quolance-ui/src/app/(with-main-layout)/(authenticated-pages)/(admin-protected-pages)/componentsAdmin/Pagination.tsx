import React from "react";
import { useProjectContext } from "../AdminContext/ProjectContext";




interface PaginationProps {
currentPage: number;
totalPages: number;
onPageChange: (pageNumber: number) => void;
}






function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
 const {
   isFirstPage,
   isLastPage,
   totalElements
 } = useProjectContext();
 const handlePrevious = () => {
  if (currentPage > 1) {
    onPageChange(currentPage - 1);
  }
};




const handleNext = () => {
  if (currentPage < totalPages) {
    onPageChange(currentPage + 1);
  }
};


const pageNumbers = []
for(let i = 0;i < totalPages;i++){
   pageNumbers.push(i +1);
}


return (
  <div className="flex items-center justify-between ">
    {/* Mobile View: Previous and Next buttons */}
    <div className="flex flex-1 justify-between lg:hidden">
      <button
        onClick={handlePrevious}
        className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
          isFirstPage ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Previous
      </button>
      <button
        onClick={handleNext}
        className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
          isLastPage ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Next
      </button>
    </div>




    {/* Desktop View: Full Pagination */}
    <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-between">
      <div>
        <p className="text-sm text-gray-700">
          Showing
          <span className="font-medium"> {(currentPage - 1) * 5 + 1} </span>
          to
          <span className="font-medium"> {Math.min(currentPage * 5, totalElements)} </span>
          of
          <span className="font-medium"> {totalElements} </span>
          results
        </p>
      </div>
      <div>
        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button
            onClick={handlePrevious}
            className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
              isFirstPage ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isFirstPage}
          >
            <span className="sr-only">Previous</span>
            <svg
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                page === currentPage
                  ? "z-10 bg-blue-500 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              }`}
            >
              {page}
            </button>
          ))}
        <button
          onClick={handleNext}
          className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
            isLastPage ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLastPage}
        >
          <span className="sr-only">Next</span>
          <svg
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.22 14.78a.75.75 0 0 1 0-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 1.06-1.06l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0Z"
              clipRule="evenodd"
            />
          </svg>
        </button>




        </nav>
      </div>
    </div>
  </div>
);
}




export default Pagination;

