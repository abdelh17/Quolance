'use client';
import { useGetAllClientProjects } from '@/api/client-api';
import { ProjectType } from '@/constants/types/project-types';
import Loading from '@/components/loading';
import Link from 'next/link';
import {
  formatDate,
  formatEnumString,
  formatPriceRange,
} from '@/util/stringUtils';
import { useRouter } from 'next/navigation';
export default function ClientDashboardTable() {
  const { data, isLoading } = useGetAllClientProjects();
  const projects = data?.data || [];

  const router = useRouter();

  const scrollToApplicants = () => {
    router.push(`/projects/${projects.id}#applicants-section`);
    // Add a small delay to ensure the DOM has updated
    setTimeout(() => {
      document.getElementById('applicants-section')?.scrollIntoView({
        behavior: 'smooth'
      });
    }, 100);
  };

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
            {projects.length === 0 ? (
              <tr>
                <td colSpan={7} className='py-12 text-center'>
                  <div className='flex flex-col items-center'>
                    <p className='mb-4 text-center text-gray-600'>
                      You haven't created any projects yet. Get started by
                      creating your first project!
                    </p>
                    <Link
                      href='/post-project'
                      className='text-sm/6 font-semibold text-gray-900'
                    >
                      Create First Project<span aria-hidden='true'>→</span>
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              projects.map((projects: ProjectType) => (
                <tr key={projects.id}>
                  <td className='w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0'>
                    {projects.title}
                  </td>
                  <td className='hidden px-3 py-4 text-sm text-gray-500 lg:table-cell'>
                    {formatPriceRange(projects.priceRange)}
                  </td>
                  <td className='hidden px-3 py-4 text-sm text-gray-500 sm:table-cell'>
                    {formatDate(projects.expirationDate)}
                  </td>
                  <td className='hidden px-3 py-4 text-sm text-gray-500 sm:table-cell'>
                    {formatEnumString(projects.category)}
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
                      Edit Project
                    </Link>
                  </td>
                  <td className='py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0'>
                    <Link
                      href={`/projects/${projects.id}/#applicants-section`}
                      onClick={scrollToApplicants}
                      className='text-b300 hover:text-indigo-900'
                    >
                      View Applicants
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
