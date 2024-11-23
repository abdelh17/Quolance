import { formatPriceRange, ProjectType } from '@/constants/types/project-types';
import Link from 'next/link';
import { formatEnumString } from '@/util/stringUtils';

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
}: ProjectCardProps) => {
  const getProjectStatusTag = () => {
    // Check if project is completed
    if (projectStatus === 'COMPLETED') {
      return {
        text: 'Closed',
        color: 'bg-gray-100 text-gray-800',
      };
    }

    // Check if project is expired
    const currentDate = new Date();
    const deliveryDateTime = new Date(expirationDate);
    if (deliveryDateTime < currentDate) {
      return {
        text: 'Expired',
        color: 'bg-red-100 text-red-800',
      };
    }

    // Check if project is new (posted within last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const isNew = new Date(createdAt) > sevenDaysAgo;

    if (isNew) {
      return {
        text: 'New',
        color: 'bg-green-100 text-green-800',
      };
    }

    // Default status
    return {
      text: 'Active',
      color: 'bg-blue-100 text-blue-800',
    };
  };

  const statusTag = getProjectStatusTag();

  return (
    <Link href={`/projects/${id}`}>
      <div className='rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg'>
        {/* Header with Title and Status */}
        <div className='mb-4 flex items-start justify-between'>
          <h3 className='truncate text-xl font-semibold text-gray-900'>
            {title}
          </h3>
          <span className={`rounded-full px-3 py-1 text-sm ${statusTag.color}`}>
            {statusTag.text}
          </span>
        </div>

        {/* Category */}
        <div className='mb-3'>
          <span className='text-sm text-gray-500'>
            {formatEnumString(category)}
          </span>
        </div>

        {/* Description */}
        <p className='mb-4 line-clamp-2 text-gray-600'>{description}</p>

        {/* Tags */}
        <div className='mb-4 flex flex-wrap gap-2'>
          {tags.map((tag, index) => (
            <span
              key={index}
              className='rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-700'
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Project Details Grid */}
        <div className='mb-4 grid grid-cols-2 gap-4'>
          <div className='flex items-center'>
            <span className='text-sm text-gray-500'>Budget:</span>
            <span className='ml-2 text-sm font-medium'>
              {formatPriceRange(priceRange)}
            </span>
          </div>
          <div className='flex items-center'>
            <span className='text-sm text-gray-500'>Experience:</span>
            <span className='ml-2 text-sm font-medium'>
              {formatEnumString(experienceLevel)}
            </span>
          </div>
        </div>

        {/* Footer with Location and Delivery Time */}
        <div className='border-t border-gray-200 pt-4'>
          <div className='flex items-center justify-between text-sm text-gray-500'>
            <div className='flex items-center'>
              <svg
                className='mr-1 h-4 w-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
              {location}
            </div>
            <div className='flex items-center'>
              <svg
                className='mr-1 h-4 w-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              {formatEnumString(expectedDeliveryTime)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
