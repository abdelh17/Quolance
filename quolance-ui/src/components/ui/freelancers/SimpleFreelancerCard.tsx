'use client';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { useChat } from '@/components/ui/chat/ChatProvider';
import FreelancerDefaultProfilePic from '@/public/images/freelancer_default_icon.png';
import { FreelancerProfileType } from '@/constants/models/user/UserResponse';
import { Send } from 'lucide-react';

interface SimpleFreelancerCardProps {
  freelancerProfile: FreelancerProfileType;
  similarityScore?: number;
}

const isImageURL = (img: string | StaticImageData): img is string => {
  return typeof img === 'string';
};

export default function SimpleFreelancerCard({
  freelancerProfile,
  similarityScore,
}: SimpleFreelancerCardProps) {
  const { onNewChat } = useChat();
  const fullName = `${freelancerProfile.firstName} ${freelancerProfile.lastName}`;
  const location = freelancerProfile.city || freelancerProfile.state || '';
  const profileImage = freelancerProfile.profileImageUrl
    ? freelancerProfile.profileImageUrl
    : FreelancerDefaultProfilePic;

  const imageProps = isImageURL(profileImage)
    ? {
        src: profileImage,
        width: 80,
        height: 80,
        className: 'object-cover',
      }
    : {
        src: profileImage,
        fill: true,
        className: 'object-cover',
      };

  return (
    <div className="rounded-3xl bg-white shadow-md p-4 transition-all duration-200 hover:shadow-lg">
      <Link href={`/public-profile/${freelancerProfile.username}`}>
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20 rounded-full overflow-hidden">
            <Image {...imageProps} alt={`${fullName}'s profile picture`} sizes="80px" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">{fullName}</h3>
          {location && <p className="text-sm text-gray-500">{location}</p>}
          {similarityScore !== undefined && (
            <p className="mt-2 text-sm text-gray-700">
              Similarity: {(similarityScore * 100).toFixed(1)}%
            </p>
          )}
        </div>
      </Link>
      <div className="mt-4 flex justify-center">
        <button
          onClick={(e) => {
            e.preventDefault();
            onNewChat(
              freelancerProfile.userId,
              fullName,
              freelancerProfile.profileImageUrl || ''
            );
          }}
          className="flex items-center gap-2 rounded-full bg-n700 px-6 py-2 text-white transition-colors duration-300 hover:bg-n900"
        >
          <Send className="text-xl" />
          <span className="text-sm">Message</span>
        </button>
      </div>
    </div>
  );
}
