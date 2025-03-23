'use client';

import LoadingSpinner1 from '@/components/ui/loading/loadingSpinner1';
import Link from 'next/link';
import {useCancelApplication, useGetAllFreelancerApplications,} from '@/api/freelancer-api';
import {useState} from 'react';
import {ArrowDown, ArrowUp, ArrowUpDown, ChevronLeftIcon, ChevronRightIcon,} from 'lucide-react';
import { formatDate } from '@/util/stringUtils';
import ApplicationStatusBadge, {ApplicationStatus,} from '@/components/ui/applications/ApplicationStatusBadge';
import Modal from '@/components/ui/Modal';
import {PiX} from 'react-icons/pi';

interface Application {
  id: string;
  status: ApplicationStatus;
  projectId: string;
  freelancerId: string;
  projectTitle: string;
  creationDate: string;
  message: string;
}

export default function FreelancerApplicationsListTable() {
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] =
        useState<Application | null>(null);
  const pageSize = 2;

  const { data, isLoading } = useGetAllFreelancerApplications({
    page,
    size: pageSize,
    sortBy,
    sortDirection,
  });

  const applications = data?.content || [];
  console.log('applications is', applications)
  const metadata = data?.metadata;

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
    setPage(0);
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) {
        return <ArrowUpDown className='ml-1 inline-block h-4 w-4'/>;
    }
      return sortDirection === 'asc' ? (
          <ArrowUp className='ml-1 inline-block h-4 w-4'/>
      ) : (
          <ArrowDown className='ml-1 inline-block h-4 w-4'/>
      );
  };

  // Using the imported formatDate function from stringUtils

  const canWithdrawApplication = (status: ApplicationStatus) => {
    return status === 'APPLIED';
  };

  const handleWithdrawClick = (application: Application, e: React.MouseEvent) => {
    e.preventDefault();
    if (!canWithdrawApplication(application.status)) return;
    setSelectedApplication(application);
    setIsDeleteModalOpen(true);
  };

    const {mutate: cancelApplication} = useCancelApplication(
        selectedApplication?.projectId || ""
    );

  const handleConfirmWithdraw = () => {
    if (selectedApplication) {
      cancelApplication(selectedApplication.id);
      setIsDeleteModalOpen(false);
      setSelectedApplication(null);
    }
  };

  if (isLoading) {
    return <LoadingSpinner1 />;
  }

  return (
      <div className='px-4 sm:px-6 lg:px-8'>
          <div className='sm:flex sm:items-center'>
              <h2 className='mt-2 text-xl font-bold text-gray-700'>My submissions</h2>
          </div>
          <div className='-mx-4 mt-8 sm:-mx-0'>
              <table className='min-w-full divide-y divide-gray-300'>
                  <thead>
            <tr>
              <th
                  scope='col'
                  className='cursor-pointer py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 hover:text-gray-700 sm:pl-0'
                  onClick={() => handleSort('id')}
              >
                <div className='flex items-center'>Project Title</div>
              </th>
              <th
                  scope='col'
                  className='hidden cursor-pointer py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 hover:text-gray-700 sm:table-cell sm:pl-0'
                  onClick={() => handleSort('creationDate')}
              >
                <div className='flex items-center'>
                  Submitted On
                  {getSortIcon('creationDate')}
                </div>
              </th>
              <th
                  scope='col'
                  className='hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell'
              >
                Application Message
              </th>
              <th
                  scope='col'
                  className='cursor-pointer px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hover:text-gray-700'
                  onClick={() => handleSort('status')}
              >
                  <div className='flex items-center'>Status</div>
              </th>
              <th scope='col' className='relative py-3.5 pl-3 pr-4 sm:pr-0'>
                <span className='sr-only'>Actions</span>
              </th>
            </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200 bg-white'>
            {applications.length === 0 ? (
                <tr>
                    <td colSpan={4} className='py-12 text-center'>
                        <div className='flex flex-col items-center'>
                            <p className='mb-4 text-center text-gray-600'>
                                You haven't submitted your application to any project yet.
                                Get started by applying to a project!
                            </p>
                            <Link
                                href='/applications'
                                className='text-sm/6 font-semibold text-gray-900'
                            >
                                Find new applications<span aria-hidden='true'>→</span>
                            </Link>
                        </div>
                    </td>
                </tr>
            ) : (
                applications.map((application: Application) => (
                    <tr key={application.id}>
                        <td data-test={`${application.projectTitle}`} className='w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0'>
                            <Link href={`/projects/${application.projectId}`}>
                                {application.projectTitle}
                            </Link>
                        </td>
                        <td data-test="submitted-date" className='hidden w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:table-cell sm:w-auto sm:max-w-none sm:pl-0'>
                            {formatDate(application.creationDate)}
                        </td>
                        <td data-test="application-message" className='hidden px-3 py-4 text-sm text-gray-500 lg:table-cell'>
                            {application.message 
                              ? application.message.substring(0, 45) + (application.message.length > 45 ? '...' : '')
                              : "No message provided"}
                        </td>
                        <td className='px-3 py-4 text-sm'>
                            <ApplicationStatusBadge status={application.status}/>
                        </td>
                        <td className='py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0'>
                            <div className='flex justify-end space-x-4'>
                                <Link
                                    href={`/projects/${application.projectId}`}
                                    className='text-b300 hover:text-indigo-900'
                                >
                                    View project
                                </Link>
                                <Link
                                    href='#'
                                    className={`${
                                        canWithdrawApplication(application.status)
                                            ? 'text-red-600 hover:text-red-800'
                                            : 'cursor-not-allowed text-gray-400'
                                    }`}
                                    onClick={(e) => handleWithdrawClick(application, e)}
                                >
                                    Withdraw submission
                                </Link>
                            </div>
                        </td>
                    </tr>
                ))
            )}
                  </tbody>
              </table>

              {metadata && (
                  <div
                      className='flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6'>
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
                                      <ChevronLeftIcon className='h-5 w-5' aria-hidden='true'/>
                                  </button>
                                  <button
                                      onClick={() => setPage(page + 1)}
                                      disabled={metadata.last}
                                      className='relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                  >
                                      <ChevronRightIcon className='h-5 w-5' aria-hidden='true'/>
                                  </button>
                              </nav>
                          </div>
                      </div>
                  </div>
              )}
          </div>

          <Modal
              isOpen={isDeleteModalOpen}
              setIsOpen={setIsDeleteModalOpen}
              title='Withdraw Application'
              icon={<PiX/>}
              iconColor='text-red-600'
              confirmText='Withdraw Application'
              confirmButtonColor='bg-red-600'
              onConfirm={handleConfirmWithdraw}
          >
              <p className='text-n300 text-lg'>
                  Are you sure you want to withdraw your application? This action:
              </p>
              <ul className='text-n300 mt-4 list-disc pl-6'>
                  <li>Cannot be undone</li>
                  <li>Will remove your application from consideration</li>
                  <li>Will allow you to apply again if you change your mind</li>
              </ul>
          </Modal>
      </div>
  );
}