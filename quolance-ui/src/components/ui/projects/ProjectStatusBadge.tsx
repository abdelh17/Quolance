import React from 'react';
import {
  CheckCircleIcon,
  ClockIcon,
  LucideIcon,
  XCircleIcon,
} from 'lucide-react';
import { ProjectStatus } from '@/constants/types/project-types';

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

interface StatusConfig {
  icon: LucideIcon;
  label: string;
  bgColor: string;
}

const statusConfigs: Record<ProjectStatus, StatusConfig> = {
  [ProjectStatus.PENDING]: {
    icon: ClockIcon,
    label: 'Pending',
    bgColor: 'bg-yellow-600',
  },
  [ProjectStatus.REJECTED]: {
    icon: XCircleIcon,
    label: 'Rejected',
    bgColor: 'bg-red-600',
  },
  [ProjectStatus.OPEN]: {
    icon: CheckCircleIcon,
    label: 'Open',
    bgColor: 'bg-green-600',
  },
  [ProjectStatus.CLOSED]: {
    icon: XCircleIcon,
    label: 'Closed',
    bgColor: 'bg-gray-600',
  },
  [ProjectStatus.EXPIRED]: {
    icon: XCircleIcon,
    label: 'Expired',
    bgColor: 'bg-gray-600',
  },
};

const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({
  status,
  className = '',
}) => {
  const config = statusConfigs[status];
  const StatusIcon = config.icon;

  return (
    <>
      <span
        className={`inline-flex items-center rounded-full py-[7px] pl-[11px] pr-[13px] text-sm font-semibold text-white ${config.bgColor} ${className}`}
      >
        <StatusIcon
          className='status-icon mr-1.5 h-5 w-5 font-semibold '
          strokeWidth={2.5}
        />
        {config.label}
      </span>
    </>
  );
};

export default ProjectStatusBadge;
