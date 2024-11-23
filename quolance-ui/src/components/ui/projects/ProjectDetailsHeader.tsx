import {
  BriefcaseIcon,
  CalendarIcon,
  CheckIcon,
  CurrencyDollarIcon,
  LinkIcon,
  PencilIcon,
} from '@heroicons/react/20/solid';
import { ProjectType } from '@/constants/types/project-types';
import {
  formatDate,
  formatEnumString,
  formatPriceRange,
} from '@/util/stringUtils';
import { Button } from '@/components/ui/button';

interface ProjectDetailsProps {
  project: ProjectType;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
}

export default function ProjectDetailsHeader({
  project,
  editMode,
  setEditMode,
}: ProjectDetailsProps) {
  console.log('project', project);
  return (
    <div className='lg:flex lg:items-center lg:justify-between'>
      <div className='min-w-0 flex-1'>
        <h2 className='mt-2 text-2xl/7 font-bold sm:truncate sm:text-3xl sm:tracking-tight'>
          {project.title}
        </h2>
        <div className='mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6'>
          <div className='mt-2 flex items-center text-sm text-gray-500'>
            <BriefcaseIcon
              aria-hidden='true'
              className='mr-1.5 h-5 w-5 shrink-0 text-gray-400'
            />
            {formatEnumString(project.category)}
          </div>
          {/* Removed location */}
          {/*<div className='mt-2 flex items-center text-sm text-gray-500'>*/}
          {/*  <MapPinIcon*/}
          {/*    aria-hidden='true'*/}
          {/*    className='mr-1.5 h-5 w-5 shrink-0 text-gray-400'*/}
          {/*  />*/}
          {/*  {project.location}*/}
          {/*</div>*/}
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
            Closing on {formatDate(project.expirationDate)}
          </div>
        </div>
      </div>
      <div className='mt-5 flex lg:ml-4 lg:mt-0'>
        <span className=''>
          <Button variant='white' size='sm' icon={<PencilIcon />}>
            <span className={'text-gray-800'}>Edit</span>
          </Button>
        </span>

        <span className='ml-3'>
          <Button
            variant='white'
            size={'sm'}
            icon={
              <LinkIcon aria-hidden='true' className='-ml-0.5 mr-1.5 h-5 w-5' />
            }
          >
            View
          </Button>
        </span>

        <span className='ml-3'>
          <Button
            variant='default'
            animation='default'
            size={'sm'}
            disabled={false}
            icon={
              <CheckIcon
                aria-hidden='true'
                className='-ml-0.5 mr-1.5 h-5 w-5'
              />
            }
          >
            Update
          </Button>
        </span>
      </div>
    </div>
  );
}
