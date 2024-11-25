import {
  BriefcaseIcon,
  CalendarIcon,
  CheckIcon,
  CurrencyDollarIcon,
  PencilIcon,
} from '@heroicons/react/20/solid';
import { ProjectStatus, ProjectType } from '@/constants/types/project-types';
import {
  formatDate,
  formatEnumString,
  formatPriceRange,
} from '@/util/stringUtils';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import { RxReset } from 'react-icons/rx';
import { useAuthGuard } from '@/api/auth-api';
import { Role } from '@/constants/models/user/UserResponse';
import Tooltip from '@/components/ui/Tooltip';
import ProjectStatusBadge from '@/components/ui/projects/ProjectStatusBadge';

interface ProjectDetailsProps {
  project: ProjectType;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  isEdited: boolean;
  resetDraftProject: () => void;
  updateProject: () => void;
}

export default function ProjectDetailsHeader({
  project,
  editMode,
  setEditMode,
  isEdited,
  resetDraftProject,
  updateProject,
}: ProjectDetailsProps) {
  const { user } = useAuthGuard({ middleware: 'auth' });

  return (
    <div className='lg:flex lg:items-center lg:justify-between'>
      <div className='min-w-0 flex-1'>
        <h2 className='mt-2 text-2xl/7 font-bold sm:truncate sm:text-3xl sm:tracking-tight'>
          {project.title}
        </h2>
        <div className='mt-2 flex flex-col items-start gap-3 sm:flex-wrap md:flex-row md:items-center'>
          <ProjectStatusBadge status={ProjectStatus.OPEN} />
          <div className='flex items-center text-sm text-gray-500'>
            <BriefcaseIcon
              aria-hidden='true'
              className='mr-1.5 h-5 w-5 shrink-0 text-gray-400'
            />
            {formatEnumString(project.category)}
          </div>
          <div className='flex items-center text-sm text-gray-500'>
            <CurrencyDollarIcon
              aria-hidden='true'
              className='mr-1.5 h-5 w-5 shrink-0 text-gray-400'
            />
            {formatPriceRange(project.priceRange)}
          </div>
          <div className='flex items-center text-sm text-gray-500'>
            <CalendarIcon
              aria-hidden='true'
              className='mr-1.5 h-5 w-5 shrink-0 text-gray-400'
            />
            Closing on {formatDate(project.expirationDate)}
          </div>
        </div>
      </div>
      <div className='mt-5 flex lg:ml-4 lg:mt-0'>
        {!editMode && user?.role == Role.CLIENT && (
          <Tooltip
            content='Cannot edit project after it is approved'
            position='bottom-end'
            disabled={project.projectStatus === 'PENDING'}
          >
            <Button
              variant='white'
              size='sm'
              icon={<PencilIcon />}
              onClick={() => setEditMode(true)}
              disabled={project.projectStatus !== 'PENDING'}
            >
              <span className='text-gray-800'>Edit</span>
            </Button>
          </Tooltip>
        )}

        {editMode && (
          <span className='ml-3'>
            <Button
              variant='white'
              size='sm'
              icon={
                <XIcon aria-hidden='true' className='-ml-0.5 mr-1.5 h-5 w-5' />
              }
              onClick={() => setEditMode(false)}
            >
              Cancel
            </Button>
          </span>
        )}

        {editMode && (
          <span className='ml-3'>
            <Button
              variant='white'
              size='sm'
              icon={
                <RxReset
                  aria-hidden='true'
                  className='-ml-0.5 mr-1.5 h-5 w-5'
                />
              }
              onClick={resetDraftProject}
              disabled={!isEdited}
            >
              Reset Changes
            </Button>
          </span>
        )}

        {editMode && (
          <span className='ml-3'>
            <Button
              variant='default'
              animation='default'
              size='sm'
              disabled={!isEdited}
              icon={
                <CheckIcon
                  aria-hidden='true'
                  className='-ml-0.5 mr-1.5 h-5 w-5'
                />
              }
              onClick={updateProject}
            >
              Update
            </Button>
          </span>
        )}
      </div>
    </div>
  );
}
