'use client';
import { useGetAllClientapplications } from '@/api/client-api';
import { ProjectType } from '@/constants/types/project-types';
import Loading from '@/components/loading';
import Link from 'next/link';
import {
  formatDate,
  formatEnumString,
  formatPriceRange,
} from '@/util/stringUtils';
import { useGetAllFreelancerApplications } from '@/api/freelancer-api';

export default function FreelancerDashboardTable() {
  const { data, isLoading } = useGetAllFreelancerApplications();
  const applications = data?.data || [];

  if (isLoading) {
    return <Loading />;
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
                className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0'
              >
                Title
              </th>
              <th
                scope='col'
                className='hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell'
              >
                Budget
              </th>
              <th
                scope='col'
                className='hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell'
              >
                Category
              </th>
              <th
                scope='col'
                className='hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell'
              >
                Experience Level desired
              </th>
              <th
                scope='col'
                className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
              >
                Status
              </th>
              <th scope='col' className='relative py-3.5 pl-3 pr-4 sm:pr-0'>
                <span className='sr-only'>View</span>
              </th>
              <th scope='col' className='relative py-3.5 pl-3 pr-4 sm:pr-0'>
                <span className='sr-only'>Withdraw</span>
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {applications.length === 0 ? (
              <tr>
                <td colSpan={7} className='py-12 text-center'>
                  <div className='flex flex-col items-center'>
                    <p className='mb-4 text-center text-gray-600'>
                      You haven't submitted your application to any project yet. Get started by applying to a project!
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
              applications.map((applications : any) => (
                <tr key={applications.id}>
                  <td className='w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0'>
                    title
                  </td>
                  <td className='hidden px-3 py-4 text-sm text-gray-500 lg:table-cell'>
                    range
                  </td>
                  <td className='hidden px-3 py-4 text-sm text-gray-500 sm:table-cell'>
                    category
                  </td>
                  <td className='hidden px-3 py-4 text-sm text-gray-500 lg:table-cell'>
                    level
                  </td>
                  <td className='px-3 py-4 text-sm text-gray-500'>
                    {applications.status}
                  </td>
                  <td className='py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0'>
                    <Link
                      href={`/projects/${applications.projectId}`}
                      className='text-b300 hover:text-indigo-900'
                    >
                      View project
                    </Link>
                  </td>
                  <td className='py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0'>
                    <Link
                      href={`/projects/${applications.id}?edit`}
                      className='text-b300 hover:text-indigo-900'
                    >
                      Withdraw my submission
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
