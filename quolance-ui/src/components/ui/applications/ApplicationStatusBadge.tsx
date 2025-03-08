'use client';

import React from 'react';
import {
  CheckCircleIcon,
  LucideIcon,
  SendIcon,
  XCircleIcon,
} from 'lucide-react';

export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

interface StatusConfig {
  icon: LucideIcon;
  label: string;
  bgColor: string;
}

const statusConfigs: Record<ApplicationStatus, StatusConfig> = {
  [ApplicationStatus.APPLIED]: {
    icon: SendIcon,
    label: 'Applied',
    bgColor: 'bg-blue-600',
  },
  [ApplicationStatus.ACCEPTED]: {
    icon: CheckCircleIcon,
    label: 'Accepted',
    bgColor: 'bg-green-600',
  },
  [ApplicationStatus.REJECTED]: {
    icon: XCircleIcon,
    label: 'Rejected',
    bgColor: 'bg-red-600',
  },
};

const ApplicationStatusBadge: React.FC<ApplicationStatusBadgeProps> = ({
  status,
  className = '',
}) => {
  const config = statusConfigs[status];
  const StatusIcon = config.icon;
  return (
    <>
      <span
        data-test="application-status"
        className={`inline-flex items-center rounded-full py-[7px] pl-[11px] pr-[13px] text-sm font-semibold text-white ${config.bgColor} ${className}`}
      >
        <StatusIcon
          className='status-icon mr-1.5 h-5 w-5 font-semibold'
          strokeWidth={2.5}
        />
        {config.label}
      </span>
    </>
  );
};

export default ApplicationStatusBadge;
