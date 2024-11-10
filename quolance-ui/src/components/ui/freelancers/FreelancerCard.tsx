'use client';
import { PiHandshake, PiHeart } from 'react-icons/pi';
import 'swiper/css';
import badge from '@/public/images/verify-badge.png';
import Image from 'next/image';
import { useState } from 'react';
import ApprovalConfirmationModal from '@/components/ui/freelancers/ApprovalConfirmationModal';
import { ApplicationStatus } from '@/constants/models/applications/ApplicationResponse';

interface FreelancerCardProps {
  img: string;
  freelancerName: string;
  handleApproveSubmission: () => void;
  location: string;
  selected?: boolean;
  onSelect: (selected: boolean) => void;
  status: ApplicationStatus;
  isApproveDisabled: boolean; // Add this prop
}

export const StatusColors = {
  APPLIED: 'blue',
  REJECTED: 'red',
  PENDING_CONFIRMATION: 'yellow',
  ACCEPTED: 'green',
  CANCELLED: 'gray',
} as const;

export const getStatusConfig = (status: ApplicationStatus) => {
  const color = StatusColors[status];
  return {
    label: formatStatusLabel(status),
    color,
    classes: {
      badge: `bg-${color}-100 text-${color}-700 border-${color}-400`,
    },
  };
};

const formatStatusLabel = (status: ApplicationStatus): string => {
  return status
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

function FreelancerCard({
  img,
  freelancerName,
  handleApproveSubmission,
  isApproveDisabled,
  location,
  selected = false,
  onSelect,
  status,
}: FreelancerCardProps) {
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const statusConfig = getStatusConfig(status);

  return (
    <>
      <div
        className={`bg-n10 relative flex h-full flex-col rounded-3xl border pb-6 transition-all duration-200 
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      >
        <div
          className={`z-30 flex flex-row-reverse items-center justify-between rounded-t-3xl border-b bg-gray-100 p-[18px]`}
        >
          <label className='-mt-[2px] mr-1 inline-flex cursor-pointer items-center'>
            <input
              type='checkbox'
              checked={selected}
              onChange={(e) => onSelect(e.target.checked)}
              className='peer sr-only'
            />
            <span className='peer relative h-[20px] w-[20px] rounded border-2 border-gray-300 bg-white after:absolute after:left-1/2 after:top-1/2 after:h-3 after:w-3 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-blue-500 after:opacity-0 after:transition-opacity peer-checked:border-blue-500 peer-checked:after:opacity-100'></span>
          </label>

          <div
            className={`w-fit rounded-full border px-3 py-1 text-sm font-medium ${statusConfig.classes.badge}`}
          >
            {statusConfig?.label}
          </div>
        </div>

        <div className='mt-5 flex items-center justify-start gap-3 px-3 sm:px-6'>
          <div className='relative max-md:overflow-hidden'>
            <div className='hexagon-styles bg-b50 my-[calc(100px*0.5/2)] h-[calc(100px*0.57736720554273)] w-[100px] rounded-[calc(100px/36.75)] before:rounded-[calc(100px/18.75)] after:rounded-[calc(100px/18.75)]'>
              <div className='absolute -top-[20px] left-[5px]'>
                <div className='hexagon-styles bg-b300 z-10 my-[calc(90px*0.5/2)] h-[calc(90px*0.57736720554273)] w-[90px] rounded-[calc(90px/50)] before:rounded-[calc(90px/50)] after:rounded-[calc(90px/50)]'>
                  <div className='absolute -top-[19px] left-[4px] z-20'>
                    <div className='hexagon-styles bg-b50 z-10 my-[calc(82px*0.5/2)] h-[calc(82px*0.57736720554273)] w-[82px] rounded-[calc(82px/50)] before:rounded-[calc(82px/50)] after:rounded-[calc(82px/50)]'>
                      <div className='r-hex3 absolute -left-0.5 -top-[19px] z-30 inline-block w-[86px] overflow-hidden'>
                        <div className='r-hex-inner3'>
                          <div
                            className='r-hex-inner-3 before:h-[86px] before:bg-cover'
                            style={{
                              backgroundImage: `url('/images/freelancer_default_icon.png')`,
                              height: '86px',
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='absolute bottom-5 right-1 z-30'>
              <Image src={badge} alt='verified badge' className='' />
            </div>
          </div>
          <div className='max-[350px]:max-w-20'>
            <div className='flex items-center justify-start gap-3'>
              <h5 className='heading-5'>{freelancerName}</h5>
              <p className='bg-y300 rounded-full px-2 py-1 text-xs font-medium'>
                PRO
              </p>
            </div>
            <p className='text-n500 pt-2'>{location}</p>
          </div>
        </div>

        <div className='mt-3 flex flex-wrap gap-2 px-6 text-[13px]'>
          <p className='bg-r50 text-r300 rounded-full px-2 py-1 font-medium'>
            $75 - $100/hr
          </p>
          <p className='bg-g50 text-g400 rounded-full px-2 py-1 font-medium'>
            TOP INDEPENDENT
          </p>
          <p className='bg-v50 text-v300 rounded-full px-2 py-1 font-medium'>
            AVAILABLE
          </p>
        </div>

        {/*<div className='text-n400 flex flex-wrap gap-2 px-6'>*/}
        {/*  <div className='bg-b50 flex items-center justify-center gap-2 rounded-xl px-3 py-2 font-medium'>*/}
        {/*    <div className={'bg-gray-300'} />*/}
        {/*    <span>Handyman</span>*/}
        {/*  </div>*/}
        {/*  <div className='bg-b50 flex items-center justify-center gap-2 rounded-xl px-3 py-2 font-medium'>*/}
        {/*    <div className={'bg-gray-300'} />*/}
        {/*    <span>Plumber </span>*/}
        {/*  </div>*/}
        {/*  <p className='bg-b50 rounded-xl px-3 py-2 font-medium'>+3</p>*/}
        {/*</div>*/}

        {/* Swiper (currently not working since I removed the images, might consider bringing it back) */}

        {/*<div className='relative'>*/}
        {/*  <Swiper*/}
        {/*    loop={true}*/}
        {/*    slidesPerView={'auto'}*/}
        {/*    spaceBetween={12}*/}
        {/*    navigation={{*/}
        {/*      nextEl: '.ara-next',*/}
        {/*      prevEl: '.ara-prev',*/}
        {/*    }}*/}
        {/*    modules={[FreeMode, Navigation]}*/}
        {/*    className='swiper expert-slider-carousel group'*/}
        {/*  >*/}
        {/*    {[0, 1, 2, 3].map((item, i) => (*/}
        {/*      <SwiperSlide className='swiper-wrapper' key={i}>*/}
        {/*        <div className={'bg-gray-300'}></div>*/}
        {/*      </SwiperSlide>*/}
        {/*    ))}*/}
        {/*    <div className='absolute left-2 right-2 top-28 z-10'>*/}
        {/*      <div className='flex w-full items-center justify-between'>*/}
        {/*        <button className='ara-prev border-r300 text-r300 hover:bg-r300 flex -translate-x-12 items-center justify-center rounded-full border-2 p-2 text-lg !leading-none opacity-0 duration-500 hover:text-white group-hover:translate-x-0 group-hover:opacity-100'>*/}
        {/*          <PiCaretLeft />*/}
        {/*        </button>*/}
        {/*        <button className='ara-next border-r300 text-r300 hover:bg-r300 flex translate-x-12 items-center justify-center rounded-full border-2 p-2 text-lg !leading-none opacity-0 duration-500 hover:text-white group-hover:translate-x-0 group-hover:opacity-100'>*/}
        {/*          <PiCaretRight />*/}
        {/*        </button>*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  </Swiper>*/}
        {/*</div>*/}

        <div className='mt-5 flex items-center justify-start gap-2 px-6'>
          <button
            onClick={() => setIsApprovalModalOpen(true)}
            disabled={
              isApproveDisabled ||
              status === 'REJECTED' ||
              status === 'CANCELLED'
            }
            className={`relative w-full overflow-hidden rounded-full px-6 py-[10px] text-sm font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:duration-700 hover:after:w-[calc(100%+2px)]
              ${
                isApproveDisabled ||
                status === 'REJECTED' ||
                status === 'CANCELLED'
                  ? 'after:bg-gray-600-400 cursor-not-allowed bg-gray-400 hover:bg-gray-500'
                  : 'bg-n700 hover:text-n900 after:bg-yellow-400'
              }`}
          >
            <div className='relative z-20 flex items-center justify-center gap-3'>
              <PiHandshake className='text-2xl !leading-none' />
              <span>Approve Submission</span>
            </div>
          </button>
          <button className='hover:bg-y300 relative flex items-center justify-center rounded-full border p-3 text-xl !leading-none duration-500'>
            <PiHeart />
          </button>
        </div>
      </div>

      <ApprovalConfirmationModal
        isOpen={isApprovalModalOpen}
        setIsOpen={setIsApprovalModalOpen}
        onConfirm={handleApproveSubmission}
        freelancerName={freelancerName}
      />
    </>
  );
}

export default FreelancerCard;
