'use client';
import { PiChatCircle, PiCheckCircle, PiHandshake } from 'react-icons/pi';
import 'swiper/css';
import './freelancerCardStyles.css';
import badge from '@/public/images/verify-badge.png';
import Image, { StaticImageData } from 'next/image';
import { useEffect, useState } from 'react';
import ApprovalConfirmationModal from '@/components/ui/freelancers/ApprovalConfirmationModal';
import { ApplicationStatus } from '@/models/applications/ApplicationResponse';
import Link from 'next/link';
import { Send } from 'lucide-react';
import ApplicationStatusBadge from '@/components/ui/applications/ApplicationStatusBadge';

import FreelancerDefaultProfilePic from '@/public/images/freelancer_default_icon.png';
import { FreelancerProfileType } from '@/models/user/UserResponse';
import { useChat } from '@/components/ui/chat/ChatProvider';
import { z } from 'zod';
import AddReviewModal from './AddReviewModal';
import { useGetFreelancerProfile } from '@/api/freelancer-api';
import { usePostReview } from '@/api/client-api';
import Tooltip from '@/components/ui/Tooltip';
import LargeModal from '@/components/ui/LargeModal';
import { formatEnumString } from '@/util/stringUtils';
import useWindowDimensions from '@/util/hooks/useWindowDimensions';

export const reviewSchema = z.object({
  title: z
    .string()
    .min(1, 'Please enter a title')
    .max(255, 'Title must contain at most 255 characters'),
  comment: z
    .string()
    .min(1, 'Please enter a review')
    .max(5000, 'Review must contain at most 5000 characters'),
  communicationRating: z.number().min(1).max(5),
  qualityOfWorkRating: z.number().min(1).max(5),
  qualityOfDeliveryRating: z.number().min(1).max(5),
  projectId: z.string().optional(),
  reviewedFreelancerId: z.string().optional(),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;

interface FreelancerCardProps {
  freelancerProfile: FreelancerProfileType;
  handleApproveSubmission: () => void;
  selected?: boolean;
  canSelect?: boolean;
  onSelect: (selected: boolean) => void;
  status: ApplicationStatus;
  message?: string;
  currentProjectId: string;
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
  message,
  currentProjectId,
}: FreelancerCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const statusConfig = getStatusConfig(status);
  const { onNewChat } = useChat();

  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [isReviewed, setIsReviewed] = useState(false);
  const { data: freelancer } = useGetFreelancerProfile(
    freelancerProfile.username as string
  );
  const { width } = useWindowDimensions();

  const fullName = `${freelancerProfile.firstName} ${freelancerProfile.lastName}`;
  const location = freelancerProfile.state || '';

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

  const [ratings, setRatings] = useState({
    title: '',
    communicationRating: 1,
    qualityOfWorkRating: 1,
    qualityOfDeliveryRating: 1,
    comment: '',
    projectId: '',
    reviewedFreelancerId: '',
  });

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<{ title: string; comment: string }>({
    title: '',
    comment: '',
  });

  const { mutateAsync: mutateReview } = usePostReview();

  const handleSubmitReview = async () => {
    const parsed = reviewSchema.safeParse(ratings);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        title: fieldErrors.title?.[0] || '',
        comment: fieldErrors.comment?.[0] || '',
      });

      return;
    }

    const updatedRatings = {
      ...ratings,
      projectId: currentProjectId,
      reviewedFreelancerId: freelancerProfile.id,
    };

    await mutateReview(updatedRatings);
    setIsReviewed(true);
    setStep(1);
    setIsAddReviewModalOpen(false);
  };

  useEffect(() => {
    if (!freelancer || !freelancer.reviews || !currentProjectId) return;

    const alreadyReviewed = freelancer.reviews.some(
      (review) => review.projectId === currentProjectId
    );

    setIsReviewed(alreadyReviewed);
  }, [freelancer, currentProjectId]);

  return (
    <div
      className={`select-animation h-full rounded-3xl transition-all duration-200 ${
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
          <ApplicationStatusBadge status={status} className={''} />
          {status === 'ACCEPTED' && (
            <button
              onClick={() => setIsAddReviewModalOpen(true)}
              disabled={isReviewed}
              className={`relative overflow-hidden rounded-full px-3 py-[6px] text-sm font-semibold
              before:absolute before:inset-0 before:left-0 before:w-0 before:rounded-full before:duration-700 hover:before:w-[calc(100%+2px)]
              ${
                isReviewed
                  ? 'bg-yellow-400 text-black'
                  : 'bg-n700 hover:text-n900 text-white before:bg-yellow-400'
              } z-10`}
            >
              <span className='relative z-10 flex items-center gap-1'>
                {isReviewed && (
                  <PiCheckCircle className='text-2xl !leading-none text-black' />
                )}
                {isReviewed ? 'Reviewed' : 'Add Review'}
              </span>
            </button>
          )}

          {canSelect && (
            <label className='relative z-10 -mt-[2px] mr-1 inline-flex cursor-pointer items-center'>
              <input
                data-test='reject-application-btn'
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

        <Link
          href={`/public-profile/${freelancerProfile.username}`}
          className='relative flex-grow pb-6'
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className='absolute inset-0 z-10' />
          <div className='mt-5 flex items-center justify-start gap-5 px-3 sm:px-6'>
            <div className='relative'>
              <div className='relative aspect-square h-[88px] w-[88px] rounded-full'>
                <Image
                  {...imageProps}
                  alt={`${fullName}'s profile`}
                  className={`aspect-square rounded-full object-cover ring-2 ring-offset-[3px] ${statusConfig.classes.outline}`}
                  sizes='88px'
                  priority
                />
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
                <h5
                  className={`heading-5 transition-colors duration-300 ${
                    isHovered ? 'text-blue-600' : 'text-inherit'
                  }`}
                >
                  {fullName}
                </h5>
              </div>
              <p className='text-n500 pt-2'>{location}</p>

              {/* Badges Section */}
              <div className='mt-3 flex flex-wrap gap-2'>
                {freelancerProfile.experienceLevel && (
                  <span className='rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800'>
                    {formatEnumString(freelancerProfile.experienceLevel)}
                  </span>
                )}
                {freelancerProfile.availability && (
                  <span className='rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800'>
                    {formatEnumString(freelancerProfile.availability)}
                  </span>
                )}
              </div>
              <div className='mt-2 flex flex-wrap gap-2'>
                {freelancerProfile.skills?.slice(0, 4).map((skill, index) => (
                  <span
                    key={index}
                    className='rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700'
                  >
                    {skill}
                  </span>
                ))}
                {freelancerProfile.skills?.length > 3 && (
                  <span className='rounded-full px-3 py-1 text-sm font-medium text-gray-700'>
                    +{freelancerProfile.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>

        {/* Buttons */}
        <div className='flex flex-col-reverse items-center justify-start gap-2 px-2 sm:flex-row sm:px-6'>
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
            <div className='w-full flex-grow'>
              <button
                data-test='approve-submission-btn'
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsApprovalModalOpen(true);
                }}
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
                  <span className={'line-clamp-1 '}>
                    {status === 'APPLIED' && canSelect
                      ? 'Approve Submission'
                      : 'Cannot Approve'}
                  </span>
                </div>
              </button>
            </div>
          )}
          <div
            className={'flex w-full flex-row justify-between gap-2 sm:w-auto'}
          >
            {canSelect && (
              <div className={'flex-grow sm:flex-auto'}>
                <Tooltip
                  className={
                    'bg-n10 rounded-xl border border-slate-200 p-2 text-slate-900'
                  }
                  content={'View application message'}
                  disabled={width < 576}
                  position='top-end'
                >
                  <button
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setIsMessageModalOpen(true);
                    }}
                    disabled={!message}
                    className={`hover:bg-n100/20 relative z-20 flex w-full flex-grow items-center justify-center rounded-full border p-3 text-xl !leading-none duration-[400ms] ${
                      !message ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                  >
                    <PiChatCircle className='text-xl' />
                    <span className='mx-[6px] line-clamp-1 truncate text-sm font-semibold sm:hidden'>
                      View message
                    </span>
                  </button>
                </Tooltip>
              </div>
            )}
            {canSelect && (
              <div className={'flex-grow sm:flex-auto'}>
                <Tooltip
                  className={
                    'bg-n10 w-full rounded-xl border border-slate-200 p-2 text-slate-900'
                  }
                  content={'Open chat'}
                  position='top-start'
                  disabled={width < 576}
                >
                  <button
                    className='hover:bg-n100/20 relative z-20 flex w-full flex-grow items-center justify-center rounded-full border p-3 text-xl !leading-none duration-[400ms]'
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      onNewChat(
                        freelancerProfile.userId,
                        fullName,
                        freelancerProfile.profileImageUrl || ''
                      );
                    }}
                  >
                    <span className='mr-2 line-clamp-1 truncate text-sm font-semibold sm:hidden'>
                      Open chat
                    </span>
                    <Send className='h-5 w-5' />
                  </button>
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      </div>

      <LargeModal
        title={`Message from: ${fullName}`}
        isOpen={isMessageModalOpen}
        setIsOpen={setIsMessageModalOpen}
        showConfirmButton={false}
        cancelText={'Close'}
      >
        <p className='text-n700 text-md whitespace-pre-wrap'>
          {message || 'No message provided'}
        </p>
      </LargeModal>

      <ApprovalConfirmationModal
        isOpen={isApprovalModalOpen}
        setIsOpen={setIsApprovalModalOpen}
        onConfirm={handleApproveSubmission}
        freelancerName={fullName}
      />

      <AddReviewModal
        isOpen={isAddReviewModalOpen}
        setIsOpen={setIsAddReviewModalOpen}
        freelancerName={fullName}
        ratings={ratings}
        setRatings={setRatings}
        errors={errors}
        setErrors={setErrors}
        step={step}
        setStep={setStep}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
}

export default FreelancerCard;
