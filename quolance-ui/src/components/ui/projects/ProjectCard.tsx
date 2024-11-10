// FILE: ProjectCard.tsx

import { ProjectType } from '@/constants/types/projectTypes';

type ProjectCardProps = ProjectType

const ProjectCard = ({
  tags,
  projectId,
  createdAt,
  projectCategory,
  projectTitle,
  projectDescription,
  priceRange,
  experienceLevel,
  expectedDeliveryTime,
  deliveryDate,
  location,
  projectStatus,
  clientId,
}: ProjectCardProps) => {
  const getProjectStatusTag = () => {
    // Check if project is completed
    if (projectStatus === 'COMPLETED') {
      return {
        text: 'Closed',
        color: 'bg-gray-100 text-gray-800'
      };
    }

    // Check if project is expired
    const currentDate = new Date();
    const deliveryDateTime = new Date(deliveryDate);
    if (deliveryDateTime < currentDate) {
      return {
        text: 'Expired',
        color: 'bg-red-100 text-red-800'
      };
    }

    // Check if project is new (posted within last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const isNew = new Date(createdAt) > sevenDaysAgo;
    
    if (isNew) {
      return {
        text: 'New',
        color: 'bg-green-100 text-green-800'
      };
    }

    // Default status
    return {
      text: 'Active',
      color: 'bg-blue-100 text-blue-800'
    };
  };

  const statusTag = getProjectStatusTag();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header with Title and Status */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900 truncate">
          {projectTitle}
        </h3>
        <span className={`px-3 py-1 rounded-full text-sm ${statusTag.color}`}>
          {statusTag.text}
        </span>
      </div>

      {/* Category */}
      <div className="mb-3">
        <span className="text-sm text-gray-500">
          {projectCategory.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-4 line-clamp-2">
        {projectDescription}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Project Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <span className="text-gray-500 text-sm">Budget:</span>
          <span className="ml-2 text-sm font-medium">
            {priceRange.replace(/_/g, ' ').toLowerCase()}
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-gray-500 text-sm">Experience:</span>
          <span className="ml-2 text-sm font-medium">
            {experienceLevel.replace(/_/g, ' ').toLowerCase()}
          </span>
        </div>
      </div>

      {/* Footer with Location and Delivery Time */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {expectedDeliveryTime.replace(/_/g, ' ').toLowerCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;