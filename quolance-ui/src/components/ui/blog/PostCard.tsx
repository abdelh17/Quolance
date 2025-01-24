"use client";

import React, { useState } from "react";
import Image from "next/image";
import icon from "@/public/images/freelancer_default_icon.png";
import PostReaction from "./PostReaction";
import { update } from "node_modules/cypress/types/lodash";

interface ReactionState {
    [key: string]: { count: number; userReacted: boolean };
}

interface PostCardProps {
    id: number;
    title: string;
    content: string;
    authorName: string;
    dateCreated: string;
    comments: string[];
}

const PostCard: React.FC<PostCardProps> = ({ 
    id, 
    title, 
    content, 
    authorName, 
    dateCreated, 
    comments 
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const [reactions, setReactions] = useState<ReactionState>({
        like: { count: 5, userReacted: false },
        love: { count: 2, userReacted: true },
        laugh: { count: 3, userReacted: false },
        shocked: { count: 1, userReacted: false },
        sad: { count: 0, userReacted: false },
        angry: { count: 0, userReacted: false },
    });

    const handleReactionClick = (reactionType: string) => {
        setReactions((prevReactions) => {
            const newReactions = { ...prevReactions };

            if (newReactions[reactionType].userReacted){
                return {
                    ...newReactions,
                    [reactionType]: {
                        ...newReactions[reactionType],
                        count: newReactions[reactionType].count - 1,
                        userReacted: false,
                }}
            } else {
                const updatedReactions = Object.keys(newReactions).reduce((reaction, key) => {
                    if (key === reactionType) {
                        reaction[key] = {
                            count: newReactions[key].count + 1,
                            userReacted: true,
                        };
                    } else if (newReactions[key].userReacted) {
                        reaction[key] = {
                            count: newReactions[key].count - 1,
                            userReacted: false,
                        };
                    } else {
                        reaction[key] = newReactions[key];
                    }
                    return reaction;
                }, {} as ReactionState);
                return updatedReactions;
            }
        });
    };

    const toggleExpand = () => setIsExpanded(!isExpanded);

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

                {/* Reaction Buttons */}
                <div className="mt-4 flex items-center gap-1">
                    {Object.keys(reactions).map((reaction) => (
                        <PostReaction
                            key={reaction}
                            reaction={reaction}
                            reactionCount={reactions[reaction].count}
                            userReaction={reactions[reaction].userReacted}
                            onReactionClick={() => handleReactionClick(reaction)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PostCard;
