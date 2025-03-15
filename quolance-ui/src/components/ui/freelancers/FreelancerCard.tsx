'use client';
import { PiCheckCircle, PiHandshake } from 'react-icons/pi';
import 'swiper/css';
import './freelancerCardStyles.css';
import badge from '@/public/images/verify-badge.png';
import Image, { StaticImageData } from 'next/image';
import { useState } from 'react';
import ApprovalConfirmationModal from '@/components/ui/freelancers/ApprovalConfirmationModal';
import { ApplicationStatus } from '@/constants/models/applications/ApplicationResponse';
import Link from 'next/link';
import { Send } from 'lucide-react';
import ApplicationStatusBadge from '@/components/ui/applications/ApplicationStatusBadge';

import FreelancerDefaultProfilePic from '@/public/images/freelancer_default_icon.png';
import { FreelancerProfileType } from '@/constants/models/user/UserResponse';

interface FreelancerCardProps {
  freelancerProfile: FreelancerProfileType;
  handleApproveSubmission: () => void;
  selected?: boolean;
  canSelect?: boolean;
  onSelect: (selected: boolean) => void;
  status: ApplicationStatus;
}

export const StatusColors = {
  APPLIED: {
    checkbox_outline: 'border-blue-300',
    outline: 'ring-blue-400',
    header: 'from-blue-200/90 to-blue-300/90 bg-gradient-to-r',
    container: 'ring-0 bg-white ring-blue-700/10',
  },
  REJECTED: {
    checkbox_outline: 'border-red-300',
    outline: 'ring-red-400',
    header: 'bg-red-600/5 bg-gradient-to-r',
    container: 'ring-0 bg-white ring-red-700/10',
  },
  ACCEPTED: {
    checkbox_outline: 'border-green-300',
    outline: 'ring-green-400',
    header: 'bg-green-600/5 bg-gradient-to-r',
    container: 'ring-1 ring-green-700/10',
  },
};

const getStatusConfig = (status: ApplicationStatus) => {
  return {
    label: formatStatusLabel(status),
    classes: StatusColors[status],
  };
};

export const formatStatusLabel = (status: ApplicationStatus): string => {
  return status
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

type ImageURL = {
  url: string;
  width: number;
  height: number;
};

const isImageURL = (img: ImageURL | StaticImageData): img is ImageURL => {
  return (img as ImageURL).url !== undefined;
};

function FreelancerCard({
  freelancerProfile,
  handleApproveSubmission,
  selected = false,
  canSelect = false,
  onSelect,
  status,
}: FreelancerCardProps) {
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const statusConfig = getStatusConfig(status);

  const fullName = `${freelancerProfile.firstName} ${freelancerProfile.lastName}`;
  const location = freelancerProfile.state || '';

  // Determine which image to show:
  const profileImage: ImageURL | StaticImageData =
    freelancerProfile.profileImageUrl
      ? { url: freelancerProfile.profileImageUrl, width: 88, height: 88 }
      : FreelancerDefaultProfilePic;

  const imageProps = isImageURL(profileImage)
    ? {
        src: profileImage.url,
        width: profileImage.width,
        height: profileImage.height,
        fill: false,
      }
    : {
        src: profileImage,
        fill: true,
      };

  return (
    <div
      className={`select-animation rounded-3xl transition-all duration-200 ${
        selected && '!ring-2 !ring-blue-500 !ring-offset-2'
      }`}
    >
      <div
        className={`shadow-animation relative flex h-full flex-col rounded-3xl pb-6 shadow-md transition-all duration-300 ease-out hover:shadow-[0_6px_10px_-2px_rgb(0_0_0_/0.13),_0_3px_5px_-3px_rgb(0_0_0_/0.13)]
        ${statusConfig.classes.container}
        ${status === 'ACCEPTED' ? 'wave-border bg-white' : 'bg-n40/10 '}`}
      >
        <div
          className={`z-30 flex items-center justify-between rounded-t-3xl p-[18px]
            ${statusConfig.classes.header}`}
        >
          {/* Status badge */}
          <ApplicationStatusBadge status={status} className={''} />
          {/* Checkbox for selecting a submission */}
          {canSelect && (
            <label className='relative z-10 -mt-[2px] mr-1 inline-flex cursor-pointer items-center'>
              <input
                data-test="reject-application-btn"
                type='checkbox'
                checked={selected}
                onChange={(e) => onSelect(e.target.checked)}
                className='peer sr-only'
              />
              <span
                className={`
                  peer relative z-50 h-[20px] w-[20px] rounded border-2 ${statusConfig.classes.checkbox_outline} bg-white
                  after:absolute after:left-1/2 after:top-1/2 after:h-3 after:w-3 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-blue-500 after:opacity-0 after:transition-opacity peer-checked:border-blue-500 peer-checked:after:opacity-100
                `}
              ></span>
            </label>
          )}
        </div>
        <Link href={''}>
          <div className='mt-5 flex items-center justify-start gap-5 px-3 sm:px-6'>
            <div className='relative'>
              <div className='relative aspect-square h-[88px] w-[88px] rounded-full'>
                {/* Profile image */}
                <Image
                  {...imageProps}
                  alt={`${fullName}'s profile`}
                  className={`aspect-square rounded-full object-cover ring-2 ring-offset-[3px] ${statusConfig.classes.outline}`}
                  sizes='88px'
                  priority
                />
                {/* Verified badge */}
                <div className='absolute -bottom-1 -right-1 z-30 hidden'>
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
                <h5 className='heading-5'>{fullName}</h5>
                {/* PRO badge could be added here */}
              </div>
              <p className='text-n500 pt-2'>{location}</p>
            </div>
          </div>

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
                data-test="approve-submission-btn"
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
              <button className='hover:bg-n100/20 relative flex items-center justify-center rounded-full border p-3 text-xl !leading-none duration-[400ms]'>
                <Send />
              </button>
            )}
          </div>
        </Link>
      </div>

      <ApprovalConfirmationModal
        isOpen={isApprovalModalOpen}
        setIsOpen={setIsApprovalModalOpen}
        onConfirm={handleApproveSubmission}
        freelancerName={fullName}
      />
    </div>
  );
}

export default FreelancerCard;
