'use client';
import { ArrowRight, Send } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PiMapPin } from 'react-icons/pi';
import { FreelancerProfileType } from '@/constants/models/user/UserResponse';
import FreelancerDefaultAvatar from '@/public/images/freelancer_default_icon.png';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface FreelancerCatalogCardProps {
  freelancer: FreelancerProfileType;
  onMessageClick: (freelancerId: number) => void;
}

const FreelancerCatalogCard = ({
  freelancer,
  onMessageClick,
}: FreelancerCatalogCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const location = [freelancer.city, freelancer.state]
    .filter(Boolean)
    .join(', ');

  return (
    <Link
      href={`/freelancers/${freelancer.username || freelancer.id}`}
      className='group'
    >
      <div
        className='shadow-animation relative flex h-full flex-col justify-between rounded-xl bg-white pb-6 shadow-md transition-all duration-300 ease-out hover:shadow-[0_6px_10px_-2px_rgb(0_0_0_/0.13),_0_3px_5px_-3px_rgb(0_0_0_/0.13)]'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className='z-30 flex items-center justify-between rounded-t-xl bg-gradient-to-r from-blue-200/20 to-blue-300/20 px-5 py-4'>
          <div className='rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-800'>
            {freelancer.experienceLevel || 'Experience not specified'}
          </div>
          <ArrowRight
            className='h-5 w-5 text-blue-600 transition-all duration-200 group-hover:translate-x-1'
            strokeWidth={isHovered ? 2.5 : 1.5}
          />
        </div>

        <div className='mt-5 px-6'>
          <div className='flex items-center gap-5'>
            <div className='relative flex aspect-square h-[88px] w-[88px] items-center rounded-full'>
              <Image
                src={freelancer.profileImageUrl || FreelancerDefaultAvatar}
                alt={`${freelancer.firstName}'s profile`}
                width={88}
                height={88}
                className='aspect-square rounded-full object-cover ring-2 ring-blue-400 ring-offset-[3px]'
                priority
              />
            </div>

            <div>
              <div className='flex items-center gap-3'>
                <h5 className='heading-5 transition-colors group-hover:text-blue-600'>
                  {`${freelancer.firstName} ${freelancer.lastName}`}
                </h5>
              </div>
              {location && (
                <div className='text-n500 flex items-center gap-1.5 pt-2'>
                  <PiMapPin className='text-lg' />
                  <span>{location}</span>
                </div>
              )}
            </div>
          </div>

          <div className='mt-4'>
            <p className='text-n600 line-clamp-2 text-sm'>{freelancer.bio}</p>
          </div>

          {freelancer.skills?.length > 0 && (
            <div className='mt-4 flex flex-wrap gap-2'>
              {freelancer.skills.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className='rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700'
                >
                  {skill}
                </span>
              ))}
              {freelancer.skills.length > 4 && (
                <span className='text-n400 pt-1 text-xs font-medium'>
                  +{freelancer.skills.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>

        <div className='mt-auto'>
          <div className='mt-6 px-6' onClick={(e) => e.preventDefault()}>
            <Button
              onClick={() => onMessageClick(freelancer.id)}
              className='w-full'
              icon={<Send />}
              bgColor='n700'
              animation='default'
              shape='full'
            >
              Get in touch
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FreelancerCatalogCard;
