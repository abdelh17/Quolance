'use client';

import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { useChat } from '@/components/ui/chat/ChatProvider';
import FreelancerDefaultProfilePic from '@/public/images/freelancer_default_icon.png';
import { FreelancerProfileType } from '@/constants/models/user/UserResponse';
import { Send, Star, MapPin, ExternalLink } from 'lucide-react';
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
  const title = '';

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
      className="relative z-10 rounded-2xl bg-white shadow-lg border border-gray-100 overflow-hidden h-full"
    >
      {scoreDisplay && (
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 relative">
          <div className="px-4 py-2.5 flex items-center justify-between">
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
                  <Star className="h-4 w-4 text-yellow-200 drop-shadow-sm" fill="currentColor" />
                </motion.div>
              </motion.div>
              <div className="flex flex-col items-start">
                <span className="text-white font-bold text-lg tracking-wide">
                  {scoreDisplay}% Match
                </span>
                <span className="text-white/80 text-xs font-light">AI-powered compatibility</span>
              </div>
            </div>
            
            {/* Score Rating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 400 }}
              className={`px-2.5 py-1 rounded-md shadow-sm font-bold text-sm tracking-wide ${
                Number(scoreDisplay) >= 90 
                  ? "bg-emerald-400/20 text-emerald-100" 
                  : Number(scoreDisplay) >= 80 
                  ? "bg-green-400/20 text-green-100" 
                  : Number(scoreDisplay) >= 70 
                  ? "bg-blue-400/20 text-blue-100"
                  : "bg-indigo-400/20 text-indigo-100"
              }`}
            >
              {Number(scoreDisplay) >= 90 ? "Perfect" : 
               Number(scoreDisplay) >= 80 ? "Excellent" : 
               Number(scoreDisplay) >= 70 ? "Great" : 
               Number(scoreDisplay) >= 60 ? "Good" : "Match"}
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        </div>
      )}
      
      <div className="p-6 pt-5">
        <Link href={`/public-profile/${freelancerProfile.username}`} className="group block">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-indigo-200 shadow-md transition-all duration-300 group-hover:ring-indigo-400">
                <Image {...imageProps} alt={`${fullName}'s profile picture`} sizes="80px" />
                <div className="absolute inset-0 rounded-full group-hover:bg-indigo-900/5 transition-colors duration-300"></div>
              </div>
              <motion.div 
                className="absolute -bottom-1 -right-1 bg-indigo-500 rounded-full p-1 shadow-md border-2 border-white"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: 'spring', stiffness: 500 }}
              >
                <ExternalLink className="h-3 w-3 text-white" />
              </motion.div>
            </div>
            
            <h3 className="mt-4 text-lg font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors">{fullName}</h3>
            
            {title && (
              <p className="text-sm font-medium text-indigo-600 mt-1">{title}</p>
            )}
            
            {location && (
              <p className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{location}</span>
              </p>
            )}
          </div>
        </Link>

        {/* Skills Tags */}
        {freelancerProfile.skills && freelancerProfile.skills.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
            {freelancerProfile.skills.slice(0, 3).map((skill, index) => (
              <span 
                key={index} 
                className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full"
              >
                {skill}
              </span>
            ))}
            {freelancerProfile.skills.length > 3 && (
              <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                +{freelancerProfile.skills.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="mt-5 flex justify-center">
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              onNewChat(
                freelancerProfile.userId,
                fullName,
                freelancerProfile.profileImageUrl || ''
              );
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-2.5 text-white transition-all duration-300 hover:shadow-md shadow-sm"
          >
            <motion.span
              whileHover={{ x: [0, 4, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Send className="h-4 w-4" />
            </motion.span>
            <span className="text-sm font-medium">Message</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}