'use client';
import { ProjectType } from '@/constants/types/project-types';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  CheckCircle,
  Clock,
  DollarSign,
} from 'lucide-react';
import { useState } from 'react';
import { formatEnumString, formatPriceRangeNoDollar } from '@/util/stringUtils';
import { EXPECTED_DELIVERY_OPTIONS } from '@/constants/types/form-types';
import RichTextDisplay from '@/components/ui/RichTextDisplay';

type ProjectCardProps = ProjectType;

const ProjectCard = ({
  tags,
  id,
  createdAt,
  category,
  title,
  description,
  priceRange,
  experienceLevel,
  expectedDeliveryTime,
  expirationDate,
  location,
  projectStatus,
  clientId,
  hasApplied,
}: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Link href={`/projects/${id}`}>
      <div
        className='shadow-animation group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 ease-out hover:shadow-[0_6px_10px_-2px_rgb(0_0_0_/0.13),_0_3px_5px_-3px_rgb(0_0_0_/0.13)]'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header (Title + Applied? + Badge) */}
        <div className='flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-blue-200/20 to-blue-300/30 p-5'>
          <h3 data-test={`${title}`} className='text-n600 text-lg font-semibold duration-150 group-hover:text-blue-600'>
            {title}
          </h3>
          <div className='flex items-center space-x-2'>
            {hasApplied && (
              <span className='flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-sm font-semibold text-blue-600'>
                <CheckCircle className='h-4 w-4' />
                Applied
              </span>
            )}
            <ArrowRight
              className='h-5 w-5 text-gray-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-blue-600'
              strokeWidth={isHovered ? 2.5 : 1.5}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className='flex flex-1 flex-col p-6'>
          {/* Description - Using flex-1 to grow */}
          <div className='flex-1'>
            <div className='text-md h-full font-medium text-gray-600'>
              <RichTextDisplay htmlContent={description} maxHeight={76} />
            </div>
          </div>
          {/* Project Details */}
          <div className='space-y-2 py-4'>
            <div className='flex flex-row justify-between gap-4'>
              <div className='flex items-center space-x-2'>
                <DollarSign className='h-4 w-4 text-gray-400' />
                <span data-test={`${priceRange}`} className='text-sm text-gray-600'>
                  {formatPriceRangeNoDollar(priceRange)}
                </span>
              </div>
              <div className='flex items-center space-x-2'>
                <Award className='h-4 w-4 text-gray-400' />
                <span data-test={`${category}`} className='text-sm text-gray-600'>
                  {formatEnumString(category)}
                </span>
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              {/*<MapPin className='h-4 w-4 text-gray-400' />*/}
              {/*<span className='text-sm text-gray-600'>{location}</span>*/}
            </div>
          </div>
          {/* Footer */}
          <div className='flex items-center justify-between border-t border-gray-100 pt-4'>
            <div className='flex items-center space-x-2'>
              {/* Tags */}
              <div className='flex flex-wrap gap-2'>
                {tags?.map((tag, index) => (
                  <span
                    key={index}
                    className='rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              <Clock className='h-4 w-4 text-gray-400' />
              <span data-test={`${expectedDeliveryTime}`} className='text-sm text-gray-600'>
                {EXPECTED_DELIVERY_OPTIONS.find(
                  (option) => option.value === expectedDeliveryTime
                )?.label ?? ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
