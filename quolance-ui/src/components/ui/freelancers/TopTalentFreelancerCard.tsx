'use client';

import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { useChat } from '@/components/ui/chat/ChatProvider';
import FreelancerDefaultProfilePic from '@/public/images/freelancer_default_icon.png';
import { FreelancerProfileType } from '@/constants/models/user/UserResponse';
import { Send, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface TopTalentFreelancerCardProps {
  freelancerProfile: FreelancerProfileType;
  similarityScore?: number;
}

const isImageURL = (img: string | StaticImageData): img is string => {
  return typeof img === 'string';
};

export default function TopTalentFreelancerCard({
  freelancerProfile,
  similarityScore,
}: TopTalentFreelancerCardProps) {
  const { onNewChat } = useChat();
  const fullName = `${freelancerProfile.firstName} ${freelancerProfile.lastName}`;
  const location = freelancerProfile.city || freelancerProfile.state || '';
  const profileImage = freelancerProfile.profileImageUrl || FreelancerDefaultProfilePic;

  const imageProps = isImageURL(profileImage)
    ? { src: profileImage, width: 80, height: 80, className: 'object-cover' }
    : { src: profileImage, fill: true, className: 'object-cover' };

  // Format score for display
  const scoreDisplay = similarityScore !== undefined 
    ? (similarityScore * 100).toFixed(0) 
    : null;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 150 }}
      className="relative z-10 rounded-2xl bg-white/80 shadow-lg ring-1 ring-n100 transition-all overflow-hidden"
    >
      {scoreDisplay && (
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 relative">
          <div className="px-3 py-3 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <motion.div 
                className="bg-white/20 backdrop-blur-sm rounded-full p-1.5 shadow-inner"
                whileHover={{ rotate: [0, 15, 0, -15, 0] }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Star className="h-4 w-4 text-yellow-200 drop-shadow-sm" />
                </motion.div>
              </motion.div>
              <div className="flex flex-col items-start">
                <span className="text-white font-bold text-lg tracking-wide">
                  {scoreDisplay}% Match
                </span>
                <span className="text-white/80 text-xs font-light">AI-powered compatibility score</span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        </div>
      )}
      
      <div className="p-6 pt-5">
        <Link href={`/public-profile/${freelancerProfile.username}`} className="group">
          <div className="flex flex-col items-center text-center">
            <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-indigo-200 shadow-md transition-all duration-300 group-hover:ring-indigo-400">
              <Image {...imageProps} alt={`${fullName}'s profile picture`} sizes="80px" />
              <div className="absolute inset-0 rounded-full group-hover:bg-indigo-900/5 transition-colors duration-300"></div>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-n800 group-hover:text-indigo-700 transition-colors">{fullName}</h3>
            {location && <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">{location}</p>}
          </div>
        </Link>

        <div className="mt-6 flex justify-center">
          <button
            onClick={(e) => {
              e.preventDefault();
              onNewChat(
                freelancerProfile.userId,
                fullName,
                freelancerProfile.profileImageUrl || ''
              );
            }}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-2.5 text-white transition-all duration-300 hover:shadow-md hover:brightness-105 shadow-sm"
          >
            <motion.span
              whileHover={{ x: [0, 4, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Send className="h-4 w-4" />
            </motion.span>
            <span className="text-sm font-medium">Message</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}