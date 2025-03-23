'use-client'

import Image from 'next/image';
import { motion } from 'framer-motion';
import { FreelancerProfileType } from '@/constants/models/user/UserResponse';
import FreelancerDefaultIcon from '@/public/images/freelancer_default_icon.png';

const UserSummary: React.FC<{user: FreelancerProfileType}> = ({ user }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-blue-50 shadow-md rounded-lg p-4 w-96 relative"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-bold text-gray-900">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-gray-600">{user.city}, {user.state}</p>
                    <p className="text-sm text-gray-600">{user.contactEmail}</p>
                </div>
                <Image
                    alt={`${user.firstName} ${user.lastName}'s profile`}
                    src={user.profileImageUrl || FreelancerDefaultIcon}
                    width={100}
                    height={100}
                    className="w-32 h-32 rounded-full object-cover"
                />
            </div>
            <div className="mt-3 text-sm text-gray-800">
                <p><strong className="text-gray-700">Experience:</strong> {user.experienceLevel}</p>
                <p><strong className="text-gray-700">Availability:</strong> {user.availability}</p>
            </div>
            <p className="mt-2 text-gray-700 text-s">{user.bio}</p>
            <div className="mt-3 flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-300 text-gray-800 rounded-md text-xs font-semibold">
                        {skill}
                    </span>
                ))}
            </div>
        </motion.div>
    );
};

export default UserSummary;