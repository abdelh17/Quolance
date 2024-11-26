'use client';
import { useGetAllClientProjects } from '@/api/client-api';
import { ProjectType } from '@/constants/types/project-types';
import Loading from '@/components/loading';
import Link from 'next/link';

export default function ClientDashboardTable() {
  const { data, isLoading, isSuccess } = useGetAllClientProjects();
  const projects = data?.data;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='px-4 sm:px-6 lg:px-8'>
      <div className='sm:flex sm:items-center'>
        <h2 className='mt-2 text-xl font-bold text-gray-700'>My projects</h2>
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
                Expiration Date
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
                <span className='sr-only'>Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {projects.map((projects: ProjectType) => (
              <tr key={projects.id}>
                <td className='w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0'>
                  {projects.title}
                </td>
                <td className='hidden px-3 py-4 text-sm text-gray-500 lg:table-cell'>
                  {projects.priceRange}
                </td>
                <td className='hidden px-3 py-4 text-sm text-gray-500 sm:table-cell'>
                  {projects.expirationDate}
                </td>
                <td className='hidden px-3 py-4 text-sm text-gray-500 sm:table-cell'>
                  {projects.category}
                </td>
                <td className='hidden px-3 py-4 text-sm text-gray-500 lg:table-cell'>
                  {projects.experienceLevel}
                </td>
                <td className='px-3 py-4 text-sm text-gray-500'>
                  {projects.projectStatus}
                </td>
                <td className='py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0'>
                  <Link
                    href={`/projects/${projects.id}?edit`}
                    className='text-b300 hover:text-indigo-900'
                  >
                    Edit<span className='sr-only'>, {projects.priceRange}</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
