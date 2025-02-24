import { FreelancerProfileType } from '@/constants/models/user/UserResponse';
import React, { useState, useEffect } from 'react';
import ProfileProgressBar from './ProfileProgressBar';
import { Button } from '@/components/ui/button';

interface ProfileStatusProps {
  profile: FreelancerProfileType;
  profilePercentage: number;
  isHidden: boolean;
  updateEditModes: (value: string) => void;
  checkEditModes: (value: string) => boolean;
}

const ProfileProgress: React.FC<ProfileStatusProps> = ({
  profile,
  profilePercentage,
  isHidden,
  updateEditModes,
  checkEditModes,
}) => {
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const filterMissingFields = () => {
    const missing = Object.entries(profile)
      .filter(
        ([key, value]) =>
          !['id', 'userId', 'username'].includes(key) &&
          (value === null ||
            value === undefined ||
            value === '' ||
            (Array.isArray(value) && value.every((item) => item === '')))
      )
      .map(([key]) => key);

    const uniqueRecommendations = Array.from(
      new Set(missing.map(getRecommendation))
    ).filter(Boolean) as string[];

    setMissingFields(uniqueRecommendations);
  };

  const getRecommendation = (key: string) => {
    switch (key) {
      case 'profileImageUrl':
        return 'Uploading a <strong>Profile Picture</strong>';
      case 'bio':
        return "Filling out the <strong>'About Me' </strong> section";
      case 'skills':
        return "Filling out the <strong>'Skills' </strong> section ";
      case 'contactEmail':
      case 'socialMediaLinks':
        return "Filling out the <strong>'Contact Information' </strong> section ";
      case 'city':
      case 'state':
        return "Filling out the <strong>'Location'</strong> section ";
      case 'firstName':
      case 'lastName':
        return "Filling out the <strong>'Name' </strong> section ";
      case 'experienceLevel':
        return "Filling out the <strong>'Experience' </strong> section ";
      case 'availability':
        return "Filling out the <strong>'Availability' </strong> section ";
      default:
        return null;
    }
  };

  const handleClick = () => {
    updateEditModes('editProfile');
  };

  useEffect(() => {
    filterMissingFields();
  }, [profile]);

  const checkModes = checkEditModes('editProfile');

  if (isHidden) return null;

  return (
    <div className='mb-8 flex flex-wrap gap-8 rounded-lg bg-white p-4  py-4 shadow-md md:justify-between lg:flex-nowrap'>
      <div className='flex items-center px-2 sm:px-8 '>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='56'
          height='56'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='lucide lucide-id-card mr-4 text-blue-500'
          style={{ transform: 'rotate(-25deg)' }}
        >
          <path d='M16 10h2' />
          <path d='M16 14h2' />
          <path d='M6.17 15a3 3 0 0 1 5.66 0' />
          <circle cx='9' cy='11' r='2' />
          <rect x='2' y='5' width='20' height='14' rx='2' />
        </svg>
        <div className='w-full sm:max-w-max'>
          <div className='text-lg font-bold'>
            Increase Your Profile Strength!
          </div>
          <ProfileProgressBar percentage={profilePercentage} />
          <div className='mb-4 text-sm'>
            We recommend you complete the following:
          </div>
          <ul className='list-decimal pl-6 text-sm'>
            {missingFields.map((recommendation, index) => (
              <li key={index}>
                <span dangerouslySetInnerHTML={{ __html: recommendation }} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className='flex  w-full  items-end  gap-2'>
        <div className='flex w-full justify-end gap-2'>
          <Button
            variant='default'
            animation='default'
            size='sm'
            disabled={checkModes}
            onClick={handleClick}
          >
            Update profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileProgress;
