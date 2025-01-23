"use client";

import React, { useState } from "react";
import Image from "next/image";
import icon from "@/public/images/freelancer_default_icon.png";
import CommentCard from "./CommentCard";
import { CommentType } from "@/constants/types/blog-types";

const mockComments = [
    {
      authorName: "John Doe",
      profilePicture: "",
      content: "This is an insightful blog post! I really enjoyed reading it.",
      dateCreated: "2025-01-21T10:30:00Z",
    },
    {
      authorName: "Jane Smith",
      profilePicture: "",
      content: "Thanks for sharing this information. It was very helpful!",
      dateCreated: "2025-01-20T14:15:00Z",
    },
    {
      authorName: "Alex Johnson",
      profilePicture: "",
      content: "I think there’s a lot to learn from this perspective. Great job!",
      dateCreated: "2025-01-19T18:45:00Z",
    },
    {
      authorName: "Emily Brown",
      profilePicture: "",
      content: "Loved this! Keep up the great work.",
      dateCreated: "2025-01-18T08:20:00Z",
    },
    {
      authorName: "Michael Green",
      profilePicture: "",
      content: "A really thought-provoking post. Thanks for sharing your thoughts!",
      dateCreated: "2025-01-17T21:10:00Z",
    },
];
  

interface PostCardProps {
    id: number;
    title: string;
    content: string;
    authorName: string;
    dateCreated: string;
    comments: CommentType[];
}

const PostCard: React.FC<PostCardProps> = ({ id, title, content, authorName, dateCreated, comments }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => setIsExpanded(!isExpanded);

    comments = mockComments;

    return (
        <div className="bg-white shadow-md rounded-md">
            {/* User Info */}
            <div className="bg-slate-300 w-full rounded-t-md">
                <div className="flex items-center mb-4 ml-5 py-5">
                    <Image
                        alt={`${authorName}'s profile`}
                        src={icon} // profilePicture
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                    />
                    <div className="ml-4">
                        <p className="font-semibold text-gray-800">{authorName}</p>
                        {/* <p className="text-sm text-gray-500">{fieldOfWork}</p> */}
                    </div>
                </div>
            </div>

            {/* Post Content */}
            <div className="ml-5 mr-5 mb-5">
                <div className="flex justify-between">
                    <h3 className="text-md font-semibold text-gray-800">{title}</h3>
                    <span className="text-sm text-gray-500">
                        {new Intl.DateTimeFormat("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            }).format(new Date(dateCreated))}
                    </span>
                </div>
                <div className={`mt-2 ${!isExpanded ? "line-clamp-3" : ""}`}>
                    <p className="text-gray-700">{content}</p>
                </div>

                {content.length > 300 && (
                    <button
                    onClick={toggleExpand}
                    className="text-blue-500 text-sm mt-2 focus:outline-none"
                >
                    {isExpanded ? "Read less" : "Read more"}
                </button>
                )}
                
                {/* Tags */}
                {/* <div className="mt-4">
                    <p className="text-sm font-semibold text-grey-800 mb-2">Tags: </p>
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs"
                        >
                            {tag}
                        </span>
                    ))}
                </div> */}

                {/* Comments */}
                {(comments !== null && comments.length > 0) && (
                    <div className="mt-4">
                        {comments.map((comment, index) => (
                            <CommentCard
                                key={index}
                                authorName={comment.authorName}
                                profilePicture={comment.profilePicture || ''}
                                content={comment.content}
                                dateCreated={comment.dateCreated}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostCard;
