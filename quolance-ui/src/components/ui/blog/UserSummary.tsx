'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { FreelancerProfileType } from '@/models/user/UserResponse';
import FreelancerDefaultIcon from '@/public/images/freelancer_default_icon.png';

const UserSummary: React.FC<{ user: FreelancerProfileType }> = ({ user }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="w-96 rounded-2xl bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-6 shadow-xl border border-gray-100 text-center"
    >

      <div className="flex justify-center -mt-16 mb-4">
        <Image
          alt={`${user.firstName} ${user.lastName}'s profile`}
          src={user.profileImageUrl || FreelancerDefaultIcon}
          width={96}
          height={96}
          className="w-24 h-24 rounded-full border-4 border-indigo-200 shadow-md object-cover"
        />
      </div>

      <div className="mb-2">
        <h3 className="text-lg font-semibold text-gray-900">
          {user.firstName} {user.lastName}
        </h3>
        <p className="text-sm text-gray-500">{user.contactEmail}</p>
        <p className="text-sm text-gray-500">
          {user.city} {user.state}
        </p>
      </div>

      <div className="my-4 flex justify-between text-sm text-left text-gray-700 border-y border-gray-100 py-3">
        <div>
          <p className="font-medium text-gray-800">Experience</p>
          <p className="text-gray-600">{user.experienceLevel || '—'}</p>
        </div>
        <div>
          <p className="font-medium text-gray-800">Availability</p>
          <p className="text-gray-600">{user.availability || '—'}</p>
        </div>
      </div>

      <p className="text-sm text-gray-700 italic mb-4">{user.bio || 'No bio provided.'}</p>

      {user.skills.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {user.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 text-xs font-medium rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default UserSummary;
