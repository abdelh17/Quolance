'use client';

import { useGetAllCandidates } from '@/api/client-api';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';
import LoadingSpinner1 from '@/components/ui/loading/loadingSpinner1';
import Link from 'next/link';
import { useState } from 'react';

export default function ClientCandidatesListTable() {
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const pageSize = 2;

  const { data, isLoading } = useGetAllCandidates({
    page,
    size: pageSize,
    sortBy,
    sortDirection,
  });

  const candidates = data?.data?.content || [];
  const metadata = data?.data?.metadata;

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
    setPage(0); // Reset to first page when sorting changes
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <ArrowUpDown className='ml-1 inline-block h-4 w-4' />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className='ml-1 inline-block h-4 w-4' />
    ) : (
      <ArrowDown className='ml-1 inline-block h-4 w-4' />
    );
  };

  if (isLoading) {
    return <LoadingSpinner1 />;
  }

  return (
    <div className='px-4 sm:px-6 lg:px-8'>
      <div className='sm:flex sm:items-center'>
        <h2 className='mt-2 text-xl font-bold text-gray-700'>All Candidates</h2>
      </div>
      <div className='-mx-4 mt-8 sm:-mx-0'>
        <table className='min-w-full divide-y divide-gray-300'>
          <thead>
            <tr>
              <th
                scope='col'
                className='cursor-pointer py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 hover:text-gray-700 sm:pl-0'
                onClick={() => handleSort('username')}
              >
                <div className='flex items-center'>
                  Username
                  {getSortIcon('username')}
                </div>
              </th>
              <th
                scope='col'
                className='cursor-pointer px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hover:text-gray-700'
                onClick={() => handleSort('firstName')}
              >
                <div className='flex items-center'>
                  First Name
                  {getSortIcon('firstName')}
                </div>
              </th>
              <th
                scope='col'
                className='cursor-pointer px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hover:text-gray-700'
                onClick={() => handleSort('lastName')}
              >
                <div className='flex items-center'>
                  Last Name
                  {getSortIcon('lastName')}
                </div>
              </th>
              <th
                scope='col'
                className='hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell'
              >
                Contact Email
              </th>
              <th
                scope='col'
                className='hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell'
              >
                Experience Level
              </th>
              <th scope='col' className='relative py-3.5 pl-3 pr-4 sm:pr-0'>
                <span className='sr-only'>Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {candidates.length === 0 ? (
              <tr>
                <td colSpan={6} className='py-12 text-center'>
                  <div className='flex flex-col items-center'>
                    <p className='mb-4 text-center text-gray-600'>
                      No candidates found.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              candidates.map((candidate: { id: string; username: string; firstName: string; lastName: string; contactEmail: string; experienceLevel?: string }) => (
                <tr key={candidate.id}>
                  <td className='w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0'>
                    <Link
                      href={`/public-profile/${candidate.username}`}
                      className='text-b300'
                    >
                      {candidate.username}
                    </Link>
                  </td>
                  <td className='px-3 py-4 text-sm text-gray-500'>
                    {candidate.firstName}
                  </td>
                  <td className='px-3 py-4 text-sm text-gray-500'>
                    {candidate.lastName}
                  </td>
                  <td className='hidden px-3 py-4 text-sm text-gray-500 sm:table-cell'>
                    {candidate.contactEmail}
                  </td>
                  <td className='hidden px-3 py-4 text-sm text-gray-500 lg:table-cell'>
                    {candidate.experienceLevel || 'Not specified'}
                  </td>
                  <td className='py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0'>
                    <div className='flex space-x-4'>
                      <Link
                        href={`/public-profile/${candidate.username}`}
                        className='text-b300 hover:text-indigo-900'
                        data-test='view-candidate-btn'
                      >
                        View Profile
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {metadata && (
          <div className='flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6'>
            <div className='flex flex-1 justify-between sm:hidden'>
              <button
                onClick={() => setPage(page - 1)}
                disabled={metadata.first}
                className='relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={metadata.last}
                className='relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
              >
                Next
              </button>
            </div>
            <div className='hidden sm:flex sm:flex-1 sm:items-center sm:justify-between'>
              <div>
                <p className='text-sm text-gray-700'>
                  Showing{' '}
                  <span className='font-medium'>
                    {metadata.pageNumber * metadata.pageSize + 1}
                  </span>{' '}
                  to{' '}
                  <span className='font-medium'>
                    {Math.min(
                      (metadata.pageNumber + 1) * metadata.pageSize,
                      metadata.totalElements
                    )}
                  </span>{' '}
                  of{' '}
                  <span className='font-medium'>{metadata.totalElements}</span>{' '}
                  results
                </p>
              </div>
              <div>
                <nav
                  className='isolate inline-flex -space-x-px rounded-md shadow-sm'
                  aria-label='Pagination'
                >
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={metadata.first}
                    className='relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                  >
                    <ChevronLeftIcon className='h-5 w-5' aria-hidden='true' />
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={metadata.last}
                    className='relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                  >
                    <ChevronRightIcon className='h-5 w-5' aria-hidden='true' />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}