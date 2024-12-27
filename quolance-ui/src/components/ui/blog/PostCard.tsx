"use client";

import React, { useState } from "react";
import Image from "next/image";
import icon from "@/public/images/freelancer_default_icon.png";

interface PostCardProps {
    type: string;
    title: string;
    body: string;
    userName: string;
    fieldOfWork: string;
    profilePicture: string; // URL
    date: string;
    tags?: string[];
}

const PostCard: React.FC<PostCardProps> = ({ type, title, body, userName, fieldOfWork, profilePicture, date, tags }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => setIsExpanded(!isExpanded);

    return (
        <div className="bg-white shadow-md rounded-md">
            {/* User Info */}
            <div className="bg-slate-300 w-full rounded-t-md">
                <div className="flex items-center mb-4 ml-5 py-5">
                    <Image
                        alt={`${userName}'s profile`}
                        src={icon} // profilePicture
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                    />
                    <div className="ml-4">
                        <p className="font-semibold text-gray-800">{userName}</p>
                        <p className="text-sm text-gray-500">{fieldOfWork}</p>
                    </div>
                </div>
            </div>

            {/* Post Content */}
            <div className="ml-5 mr-5 mb-5">
                <div className="flex justify-between">
                    <h3 className="text-md font-semibold text-gray-800">[{type}] : {title}</h3>
                    <span className="text-sm text-gray-500">{date}</span>
                </div>
                <div className={`mt-2 ${!isExpanded ? "line-clamp-3" : ""}`}>
                    <p className="text-gray-700">{body}</p>
                </div>

                {body.length > 300 && (
                    <button
                    onClick={toggleExpand}
                    className="text-blue-500 text-sm mt-2 focus:outline-none"
                >
                    {isExpanded ? "Read less" : "Read more"}
                </button>
                )}
                
                {/* Tags */}
                <div className="mt-4">
                    <p className="text-sm font-semibold text-grey-800 mb-2">Tags: </p>
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PostCard;
