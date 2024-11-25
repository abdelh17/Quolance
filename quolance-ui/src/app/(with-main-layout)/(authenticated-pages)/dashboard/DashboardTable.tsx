'use client';

export default function DashboardTable() {
  const people = [
    {
      name: 'Lindsay Walton',
      title: 'Front-end Developer',
      email: 'lindsay.walton@example.com',
      role: 'Member',
    },
    // More people...
  ];
  return (
    <div className='px-4 sm:px-6 lg:px-8'>
      <div className='sm:flex sm:items-center'>
          <h2 className='mt-2 text-xl font-bold text-gray-700'>
            My projects
          </h2>
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
                Date
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
            {people.map((person) => (
              <tr key={person.email}>
                <td className='w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0'>
                  {person.name}
                  <dl className='font-normal lg:hidden'>
                    <dt className='sr-only'>Title</dt>
                    <dd className='mt-1 truncate text-gray-700'>
                      {person.title}
                    </dd>
                    <dt className='sr-only sm:hidden'>Email</dt>
                    <dd className='mt-1 truncate text-gray-500 sm:hidden'>
                      {person.email}
                    </dd>
                  </dl>
                </td>
                <td className='hidden px-3 py-4 text-sm text-gray-500 lg:table-cell'>
                  {person.title}
                </td>
                <td className='hidden px-3 py-4 text-sm text-gray-500 sm:table-cell'>
                  {person.email}
                </td>
                <td className='px-3 py-4 text-sm text-gray-500'>
                  {person.role}
                </td>
                <td className='py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0'>
                  <a href='#' className='text-b300 hover:text-indigo-900'>
                    Edit<span className='sr-only'>, {person.name}</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
