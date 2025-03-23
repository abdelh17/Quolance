'use client';
import { ProjectType } from '@/constants/types/project-types';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  Briefcase,
  MapPin,
  Tag,
  Star,
} from 'lucide-react';
import { useState } from 'react';
import { formatEnumString, formatPriceRangeNoDollar } from '@/util/stringUtils';
import { EXPECTED_DELIVERY_OPTIONS } from '@/constants/types/form-types';
import RichTextDisplay from '@/components/ui/RichTextDisplay';

type ProjectCardProps = ProjectType;

const ProjectCard = ({
  tags,
  id,
  creationDate,
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

  // Calculate days remaining until expiration
  const getDaysRemaining = () => {
    if (!expirationDate) return null;
    const now = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <Link href={`/projects/${id}`} className='block w-full'>
      <div
        className='relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:bg-gray-50'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top row with applied badge and date */}
        <div className='mb-3 flex items-center justify-between'>
          {hasApplied && (
            <span className='inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700'>
              <CheckCircle className='h-3 w-3' />
              Applied
            </span>
          )}
        </div>

        {/* Title */}
        <h5
          className='mb-2 line-clamp-1 text-xl font-bold tracking-tight text-gray-900'
          data-test={`${title}`}
        >
          {title}
        </h5>

        {/* Description */}
        <div className='mb-4 text-sm text-gray-700'>
          <RichTextDisplay htmlContent={description} maxHeight={60} />
        </div>

        {/* Expires soon warning */}
        {daysRemaining !== null && daysRemaining <= 3 && (
          <span className='flex items-center gap-1 text-xs font-medium text-amber-600'>
            <Clock className='h-3 w-3' />
            {daysRemaining === 0
              ? 'Expires today'
              : `Expires in  ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}`}
          </span>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className='mb-4 flex flex-wrap gap-1.5'>
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className='flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600'
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className='rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500'>
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Divider */}
        <div className='my-4 h-px bg-gray-200'></div>

        {/* Project details grid */}
        <div className='mb-4 grid grid-cols-2 gap-x-4 gap-y-3'>
          <div className='flex items-center gap-2' data-test={`${priceRange}`}>
            <DollarSign className='h-4 w-4 text-gray-400' />
            <span className='text-sm font-medium text-gray-700'>
              {formatPriceRangeNoDollar(priceRange)}
            </span>
          </div>

          <div className='flex items-center gap-2' data-test={`${category}`}>
            <Award className='h-4 w-4 text-gray-400' />
            <span className='text-sm font-medium text-gray-700'>
              {formatEnumString(category)}
            </span>
          </div>

          <div
            className='flex items-center gap-2'
            data-test={`${expectedDeliveryTime}`}
          >
            <Clock className='h-4 w-4 text-gray-400' />
            <span className='text-sm font-medium text-gray-700'>
              {EXPECTED_DELIVERY_OPTIONS.find(
                (option) => option.value === expectedDeliveryTime
              )?.label ?? ''}
            </span>
          </div>

          {experienceLevel && (
            <div className='flex items-center gap-2'>
              <Star className='h-4 w-4 text-gray-400' />
              <span className='text-sm font-medium text-gray-700'>
                {formatEnumString(experienceLevel)}
              </span>
            </div>
          )}

          {location && !experienceLevel && (
            <div className='flex items-center gap-2'>
              <MapPin className='h-4 w-4 text-gray-400' />
              <span className='text-sm font-medium text-gray-700'>
                {location}
              </span>
            </div>
          )}
        </div>

        {/* Location (if experienceLevel exists and pushed location out of grid) */}
        {location && experienceLevel && (
          <div className='mb-4 flex items-center gap-2'>
            <MapPin className='h-4 w-4 text-gray-400' />
            <span className='text-sm font-medium text-gray-700'>
              {location}
            </span>
          </div>
        )}

        {/* Bottom row with status and expiration */}
        <div className='flex items-center justify-between'>
          {/* Status badge */}
          {projectStatus && (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                projectStatus === 'OPEN'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              <Briefcase className='mr-1 h-3 w-3' />
              {projectStatus === 'OPEN' ? 'Open for proposals' : 'Closed'}
            </span>
          )}

          {/* View details arrow */}
          <ArrowRight
            className='ml-auto h-5 w-5 text-gray-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-blue-600'
            strokeWidth={isHovered ? 2 : 1.5}
          />
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
