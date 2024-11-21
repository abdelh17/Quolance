'use client';
import { PiHandshake, PiHeart } from 'react-icons/pi';
import 'swiper/css';
import badge from '@/public/images/verify-badge.png';
import Image from 'next/image';
import { useState } from 'react';
import ApprovalConfirmationModal from '@/components/ui/freelancers/ApprovalConfirmationModal';
import { ApplicationStatus } from '@/constants/models/applications/ApplicationResponse';

interface BasicFreelancerCardProps {
  img: string;
  freelancerName: string;
  location: string;
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

function BasicFreelancerCard({
  img,
  freelancerName,
  location,
}: BasicFreelancerCardProps) {

  return (
    <>
      <div
        className={`bg-n10 relative flex h-full flex-col rounded-3xl border pb-6 transition-all duration-200`}
      >

        <div className='mt-5 flex items-center justify-start gap-3 px-3 sm:px-6'>
          <div className='relative max-md:overflow-hidden'>
            <div className='hexagon-styles bg-b50 my-[calc(100px*0.5/2)] h-[calc(100px*0.57736720554273)] w-[100px] rounded-[calc(100px/36.75)] before:rounded-[calc(100px/18.75)] after:rounded-[calc(100px/18.75)]'>
              <div className='absolute -top-[20px] left-[5px]'>
                <div className='hexagon-styles bg-b300 z-10 my-[calc(90px*0.5/2)] h-[calc(90px*0.57736720554273)] w-[90px] rounded-[calc(90px/50)] before:rounded-[calc(90px/50)] after:rounded-[calc(90px/50)]'>
                  <div className='absolute -top-[19px] left-[4px] z-20'>
                    <div className='hexagon-styles bg-b50 z-10 my-[calc(82px*0.5/2)] h-[calc(82px*0.57736720554273)] w-[82px] rounded-[calc(82px/50)] before:rounded-[calc(82px/50)] after:rounded-[calc(82px/50)]'>
                      <div className='r-hex3 absolute -left-0.5 -top-[19px] z-30 inline-block w-[86px] overflow-hidden'>
                        <div className='r-hex-inner1'>
                          <div
                            className='r-hex-inner-3 before:h-[86x] before:bg-cover'
                            style={{
                                backgroundImage:  `url(${img})`,
                                backgroundSize: 'cover', // or 'contain'
                                backgroundPosition: 'center', // Centers the image
                                backgroundRepeat: 'no-repeat', // Prevents tiling
                                height: '86px',
                                width: '86px',
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
        <div className='mt-5 flex items-center justify-end gap-2 px-6'>
          <button className='hover:bg-y300 relative flex items-center justify-center rounded-full border p-3 text-xl !leading-none duration-500'>
            <PiHeart />
          </button>
        </div>
      </div>
    </>
  );
}

export default BasicFreelancerCard;
