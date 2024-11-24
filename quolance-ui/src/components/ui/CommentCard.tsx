// components/ui/CommentCard.tsx
import Image,{ StaticImageData }  from 'next/image';
import React from 'react';

interface CommentCardProps {
  img: StaticImageData | string;
  name: string;
  location: string;
  comment: string;
}

const CommentCard: React.FC<CommentCardProps> = ({ img, name, location, comment }) => {
  return (
    <div className="p-4 bg-white shadow-md rounded-md">
    <div className="flex items-center mb-4">
      <Image
        src={img}
        alt={name}
        className="rounded-full object-cover"
        width={48}
        height={48}
      />
      <div className="ml-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-gray-500">{location}</p>
      </div>
    </div>
    <p className="text-gray-700">{comment}</p>
  </div>
);
};


export default CommentCard;