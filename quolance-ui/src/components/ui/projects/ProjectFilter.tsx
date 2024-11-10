import { Fragment, useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { FunnelIcon } from '@heroicons/react/20/solid';

const sortOptions = [
  { name: 'Name (A-Z)', value: 'name-asc', current: false },
  { name: 'Name (Z-A)', value: 'name-desc', current: false },
  { name: 'Date (Newest)', value: 'date-desc', current: true },
  { name: 'Date (Oldest)', value: 'date-asc', current: false },
];

const categoryOptions = [
  { name: 'All', value: 'all', current: true },
  { name: 'Work', value: 'work', current: false },
  { name: 'Personal', value: 'personal', current: false },
  { name: 'Archive', value: 'archive', current: false },
];

const orderByOptions = [
  { name: 'Ascending', value: 'asc', current: true },
  { name: 'Descending', value: 'desc', current: false },
];



export default function Example() {
  const [activeFilters, setActiveFilters] = useState({
    sort: 'date-desc',
    category: 'all',
    orderBy: 'asc'
  });

  return (
    <div className="bg-white">

      <Disclosure
        as="section"
        aria-labelledby="filter-heading"
        className="grid items-center border-b border-t border-gray-200"
      >
        <h2 id="filter-heading" className="sr-only">
          Filters
        </h2>
        <div className="relative col-start-1 row-start-1 py-4">
          <div className="mx-auto flex max-w-7xl space-x-6 divide-x divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
            <div className="flex space-x-6">
              {/* Sort */}
              <select
                value={activeFilters.sort}
                onChange={(e) => setActiveFilters({...activeFilters, sort: e.target.value})}
                className="rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.name}
                  </option>
                ))}
              </select>

              {/* Category */}
              <select
                value={activeFilters.category}
                onChange={(e) => setActiveFilters({...activeFilters, category: e.target.value})}
                className="rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.name}
                  </option>
                ))}
              </select>

              {/* Order By */}
              <select
                value={activeFilters.orderBy}
                onChange={(e) => setActiveFilters({...activeFilters, orderBy: e.target.value})}
                className="rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {orderByOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <FunnelIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <span className="ml-2 text-gray-500">
                {Object.keys(activeFilters).length} Filters
              </span>
            </div>
          </div>
        </div>
      </Disclosure>
    </div>
  );
}