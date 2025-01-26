"use client";
import React, { useState } from "react";
import Image from "next/image";
import icon from "@/public/images/freelancer_default_icon.png";

interface CommentCardProps {
  authorName: string;
  profilePicture: string;
  content: string;
  dateCreated: string;
}

const CommentCard: React.FC<CommentCardProps> = ({
  authorName,
  profilePicture,
  content,
  dateCreated,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className="flex items-start gap-4 py-1.5">
      {/* User Profile Picture */}
      <Image
        alt={`${authorName}'s profile`}
        src={profilePicture || icon}
        width={32}
        height={32}
        className="rounded-full object-cover"
      />

      {/* Comment Content */}
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold text-gray-800">{authorName}</p>
          <span className="text-xs text-gray-500">
            {new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }).format(new Date(dateCreated))}
          </span>
        </div>

        <p className="text-sm text-gray-700 mt-1">
          {content.length > 150 && !isExpanded
            ? `${content.substring(0, 150)}...`
            : content}
          {content.length > 150 && (
            <button
              onClick={toggleExpand}
              className="text-blue-500 text-xs ml-1 hover:underline"
            >
              {isExpanded ? "Show less" : "Show more"}
            </button>
          )}
        </p>
      </div>
    </div>
  );
};

export default CommentCard;
