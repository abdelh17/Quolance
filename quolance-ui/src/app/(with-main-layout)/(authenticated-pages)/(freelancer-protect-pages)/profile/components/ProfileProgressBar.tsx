import React from 'react';

interface ProfileProgressBarProps {
  percentage: number;
}

const ProfileProgressBar: React.FC<ProfileProgressBarProps> = ({
  percentage,
}) => {
  const progressColors = [
    'bg-red-300', // 0-20%
    'bg-orange-300', // 21-40%
    'bg-yellow-300', // 41-60%
    'bg-blue-300', // 61-80%
    'bg-green-300', // 81-100%
  ];

  const getColor = (percentage: number) => {
    if (percentage <= 20) return progressColors[0];
    if (percentage <= 40) return progressColors[1];
    if (percentage <= 60) return progressColors[2];
    if (percentage <= 80) return progressColors[3];
    return progressColors[4];
  };

  return (
    <div className='flex items-center gap-1 w-full max-w-full overflow-hidden'>
      <div className='text-xs font-semibold shrink-0'>{percentage}%</div>
      <div className='h-2 w-full max-w-full rounded bg-gray-200'>
        <div
          className={`h-full ${getColor(
            percentage
          )} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProfileProgressBar;