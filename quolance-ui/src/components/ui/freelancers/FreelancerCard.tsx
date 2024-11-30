'use client';
import { PiCheckCircle, PiHandshake, PiHeart } from 'react-icons/pi';
import 'swiper/css';
import './freelancerCardStyles.css';
import badge from '@/public/images/verify-badge.png';
import Image, { StaticImageData } from 'next/image';
import { useState } from 'react';
import ApprovalConfirmationModal from '@/components/ui/freelancers/ApprovalConfirmationModal';
import { ApplicationStatus } from '@/constants/models/applications/ApplicationResponse';

interface FreelancerCardProps {
  img: ImageURL | StaticImageData;
  freelancerName: string;
  handleApproveSubmission: () => void;
  location: string;
  selected?: boolean;
  canSelect?: boolean;
  onSelect: (selected: boolean) => void;
  status: ApplicationStatus;
}

type ImageURL = {
  url: string;
  width: number;
  height: number;
};

const StatusColors = {
  APPLIED: {
    badge: 'bg-blue-500/20 text-blue-900',
    outline: 'ring-blue-400',
    header: 'bg-blue-700/10',
    container: 'ring-0 bg-white ring-blue-700/10',
  },
  REJECTED: {
    badge: 'bg-red-500/20 text-red-900',
    outline: 'ring-red-400',
    header: 'bg-red-700/10',
    container: 'ring-0 bg-white ring-red-700/10',
  },
  PENDING_CONFIRMATION: {
    badge: 'bg-yellow-500/20 text-yellow-900',
    outline: 'ring-yellow-700/10',
    header: 'bg-yellow-700/10',
    container: 'ring-0 bg-white ring-yellow-700/10',
  },
  ACCEPTED: {
    badge: 'bg-green-500/20 text-green-900',
    outline: 'ring-green-400',
    header: 'border-green-200 bg-green-700/10',
    container: 'ring-1 ring-green-700/10',
  },
  CANCELLED: {
    badge: 'bg-gray-500/20 text-gray-900',
    outline: 'ring-gray-400',
    header: 'bg-gray-700/10',
    container: 'ring-0 bg-white ring-gray-700/10',
  },
} as const;

const getStatusConfig = (status: ApplicationStatus) => {
  return {
    label: formatStatusLabel(status),
    classes: StatusColors[status],
  };
};

const formatStatusLabel = (status: ApplicationStatus): string => {
  return status
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

const isImageURL = (img: ImageURL | StaticImageData): img is ImageURL => {
  return (img as ImageURL).url !== undefined;
};

function FreelancerCard({
  img,
  freelancerName,
  handleApproveSubmission,
  location,
  selected = false,
  canSelect = false,
  onSelect,
  status,
}: FreelancerCardProps) {
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const statusConfig = getStatusConfig(status);

  const imageProps = isImageURL(img)
    ? {
        src: img.url,
        width: img.width,
        height: img.height,
        fill: false,
      }
    : {
        src: img,
        fill: true,
      };

  return (
    <div
      className={`select-animation rounded-3xl transition-all duration-200 ${
        selected && '!ring-2 !ring-blue-500 !ring-offset-2'
      }`}
    >
      <div
        className={`shadow-animation relative flex h-full flex-col rounded-3xl pb-6 shadow-md transition-all duration-300 ease-out hover:shadow-lg
        ${statusConfig.classes.container}
        ${status === 'ACCEPTED' ? 'wave-border bg-white' : 'bg-n40/10 '}`}
      >
        <div
          className={`z-30 flex items-center justify-between rounded-t-3xl p-[18px]
            ${statusConfig.classes.header}`}
        >
          {/* Status badge */}
          <div
            className={`w-fit rounded-full px-3.5 py-1.5 text-sm font-semibold 
              ${statusConfig.classes.badge}`}
          >
            {statusConfig?.label}
          </div>
          {/* Checkbox for selecting a submission */}
          {canSelect && (
            <label className='-mt-[2px] mr-1 inline-flex cursor-pointer items-center'>
              <input
                type='checkbox'
                checked={selected}
                onChange={(e) => onSelect(e.target.checked)}
                className='peer sr-only'
              />
              <span
                className={`
                  peer relative h-[20px] w-[20px] rounded border-2 border-gray-300 bg-white 
                  after:absolute after:left-1/2 after:top-1/2 after:h-3 after:w-3 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-blue-500 after:opacity-0 after:transition-opacity peer-checked:border-blue-500 peer-checked:after:opacity-100
                `}
              ></span>
            </label>
          )}
        </div>

        <div className='mt-5 flex items-center justify-start gap-3 px-3 sm:px-6'>
          <div className='relative'>
            <div className='relative h-[88px] w-[88px] rounded-full'>
              {/* Profile image */}
              <Image
                {...imageProps}
                alt={`${freelancerName}'s profile`}
                className={`rounded-full object-cover ring-2 ring-offset-[3px] ${statusConfig.classes.outline}`}
                sizes='88px'
                priority
              />
              {/* Verified badge */}
              <div className='absolute -bottom-1 -right-1 z-30'>
                <Image
                  src={badge}
                  alt='verified badge'
                  width={24}
                  height={24}
                />
              </div>
            </div>
          </div>
          <div className='max-[350px]:max-w-20'>
            <div className='flex items-center justify-start gap-3'>
              <h5 className='heading-5'>{freelancerName}</h5>
              {/* PRO badge */}
              <p className='bg-y300 rounded-full px-2 py-1 text-xs font-medium'>
                PRO
              </p>
            </div>
            <p className='text-n500 pt-2'>{location}</p>
          </div>
        </div>

        {/* Freelancer Tags */}
        {/*<div className='mt-6 flex flex-wrap gap-2 px-6 text-[13px]'>*/}
        {/*  <p className='bg-r50 text-r300 rounded-full px-2 py-1 font-medium'>*/}
        {/*    $75 - $100/hr*/}
        {/*  </p>*/}
        {/*  <p className='bg-g50 text-g400 rounded-full px-2 py-1 font-medium'>*/}
        {/*    TOP INDEPENDENT*/}
        {/*  </p>*/}
        {/*  <p className='bg-v50 text-v300 rounded-full px-2 py-1 font-medium'>*/}
        {/*    AVAILABLE*/}
        {/*  </p>*/}
        {/*</div>*/}

        {/* Approve submission buttons */}
        <div className='mt-6 flex items-center justify-start gap-2 px-6'>
          {status === 'ACCEPTED' ? (
            <button
              disabled
              className='wave-bg relative w-full overflow-hidden rounded-full px-6 py-[10px] text-sm font-semibold text-white shadow-sm'
            >
              <div className='relative z-20 flex items-center justify-center gap-3'>
                <PiCheckCircle className='text-2xl !leading-none text-white' />
                <span>Submission Approved</span>
              </div>
            </button>
          ) : (
            <button
              onClick={() => setIsApprovalModalOpen(true)}
              disabled={!canSelect}
              className={`relative w-full overflow-hidden rounded-full px-6 py-[10px] text-sm font-semibold duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:duration-700 hover:after:w-[calc(100%+2px)]
                ${
                  !canSelect
                    ? 'bg-gray-700/20 text-white hover:bg-gray-700/30'
                    : 'bg-n700 hover:text-n900 text-white after:bg-yellow-400'
                }`}
            >
              <div className='relative z-20 flex items-center justify-center gap-3'>
                <PiHandshake className='text-2xl !leading-none ' />
                <span>
                  {status === 'APPLIED' && canSelect
                    ? 'Approve Submission'
                    : 'Cannot Approve'}
                </span>
              </div>
            </button>
          )}
          {canSelect && (
            <button className='hover:bg-y300 relative flex items-center justify-center rounded-full border p-3 text-xl !leading-none duration-500'>
              <PiHeart />
            </button>
          )}
        </div>
      </div>

      <ApprovalConfirmationModal
        isOpen={isApprovalModalOpen}
        setIsOpen={setIsApprovalModalOpen}
        onConfirm={handleApproveSubmission}
        freelancerName={freelancerName}
      />
    </div>
  );
}

export default FreelancerCard;
