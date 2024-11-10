import {
  BriefcaseIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  LinkIcon,
  MapPinIcon,
  PencilIcon,
} from '@heroicons/react/20/solid';
import { Menu, MenuButton } from '@headlessui/react';
import { formatPriceRange, ProjectType } from '@/constants/types/project-types';
import { formatEnumString } from '@/util/stringUtils';

interface ProjectDetailsProps {
  project: ProjectType;
}

export default function ProjectDetailsHeader({ project }: ProjectDetailsProps) {
  return (
    <div className='lg:flex lg:items-center lg:justify-between'>
      <div className='min-w-0 flex-1'>
        <h2 className='mt-2 text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'>
          {project.projectTitle}
        </h2>
        <div className='mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6'>
          <div className='mt-2 flex items-center text-sm text-gray-500'>
            <BriefcaseIcon
              aria-hidden='true'
              className='mr-1.5 h-5 w-5 shrink-0 text-gray-400'
            />
            {formatEnumString(project.projectCategory)}
          </div>
          <div className='mt-2 flex items-center text-sm text-gray-500'>
            <MapPinIcon
              aria-hidden='true'
              className='mr-1.5 h-5 w-5 shrink-0 text-gray-400'
            />
            {project.location}
          </div>
          <div className='mt-2 flex items-center text-sm text-gray-500'>
            <CurrencyDollarIcon
              aria-hidden='true'
              className='mr-1.5 h-5 w-5 shrink-0 text-gray-400'
            />
            {formatPriceRange(project.priceRange)}
          </div>
          <div className='mt-2 flex items-center text-sm text-gray-500'>
            <CalendarIcon
              aria-hidden='true'
              className='mr-1.5 h-5 w-5 shrink-0 text-gray-400'
            />
            Closing on {project.deliveryDate}
          </div>
        </div>
      </div>
      <div className='mt-5 flex lg:ml-4 lg:mt-0'>
        <span className=''>
          <button
            type='button'
            className='inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
          >
            <PencilIcon
              aria-hidden='true'
              className='-ml-0.5 mr-1.5 h-5 w-5 text-gray-400'
            />
            Edit
          </button>
        </span>

        <span className='ml-3'>
          <button
            type='button'
            className='inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
          >
            <LinkIcon
              aria-hidden='true'
              className='-ml-0.5 mr-1.5 h-5 w-5 text-gray-400'
            />
            View
          </button>
        </span>

        <span className='sm:ml-3'>
          <button
            type='button'
            className='bg-b300 hover:bg-b400 inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          >
            <CheckIcon aria-hidden='true' className='-ml-0.5 mr-1.5 h-5 w-5' />
            Publish
          </button>
        </span>

        {/* Dropdown */}
        <Menu as='div' className='relative ml-3 sm:hidden'>
          <MenuButton className='inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400'>
            More
            <ChevronDownIcon
              aria-hidden='true'
              className='-mr-1 ml-1.5 h-5 w-5 text-gray-400'
            />
          </MenuButton>

          {/*<MenuItems*/}
          {/*  transition*/}
          {/*  className='absolute right-0 z-10 -mr-1 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in'*/}
          {/*>*/}
          {/*  <MenuItem>*/}
          {/*    <a*/}
          {/*      href='#'*/}
          {/*      className='block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none'*/}
          {/*    >*/}
          {/*      Edit*/}
          {/*    </a>*/}
          {/*  </MenuItem>*/}
          {/*  <MenuItem>*/}
          {/*    <a*/}
          {/*      href='#'*/}
          {/*      className='block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none'*/}
          {/*    >*/}
          {/*      View*/}
          {/*    </a>*/}
          {/*  </MenuItem>*/}
          {/*</MenuItems>*/}
        </Menu>
      </div>
    </div>
  );
}
