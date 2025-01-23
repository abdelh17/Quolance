"use client";

import React, { useState } from "react";
import Image from "next/image";
import icon from "@/public/images/freelancer_default_icon.png";
import CommentCard from "./CommentCard";
import { CommentType } from "@/constants/types/blog-types";
import { useAuthGuard } from "@/api/auth-api";

const mockComments = [
    {
        authorName: "John Doe",
        profilePicture: "",
        content:
        "This is an insightful blog post! I really enjoyed reading it. This is an insightful blog post! I really enjoyed reading it. This is an insightful blog post! I really enjoyed reading it. This is an insightful blog post! I really enjoyed reading it. This is an insightful blog post! I really enjoyed reading it. This is an insightful blog post! I really enjoyed reading it. This is an insightful blog post! I really enjoyed reading it. This is an insightful blog post! I really enjoyed reading it. This is an insightful blog post! I really enjoyed reading it. This is an insightful blog post! I really enjoyed reading it.",
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

const PostCard: React.FC<PostCardProps> = ({
    id,
    title,
    content,
    authorName,
    dateCreated,
    comments,
    }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState<string>("");
    const [allComments, setAllComments] = useState<CommentType[]>(mockComments);
    const { user } = useAuthGuard({ middleware: "auth" });

    const toggleExpand = () => setIsExpanded(!isExpanded);
    const toggleComments = () => setShowComments(!showComments);

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        if (!user?.username) {
            console.error("User is not properly authenticated. Username is missing.");
            throw new Error("User must be authenticated with a valid username to comment.");
        }
        const newCommentObject: CommentType = {
            authorName: user.username,
            profilePicture: "",
            content: newComment,
            dateCreated: new Date().toISOString(),
        };

        setAllComments((prevComments) => [newCommentObject, ...prevComments]);
        setNewComment("");
    };

    return (
        <div className="bg-white shadow-md rounded-md">
            {/* User Info */}
            <div className="bg-slate-300 w-full rounded-t-md">
                <div className="flex items-center mb-4 ml-5 py-5">
                    <Image
                    alt={`${authorName}'s profile`}
                    src={icon}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                    />
                    <div className="ml-4">
                        <p className="font-semibold text-gray-800">{authorName}</p>
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
        
                {/* Comments Toggle */}
                <div className="mt-4">
                    <button
                    onClick={toggleComments}
                    className="text-blue-500 text-sm focus:outline-none"
                    >
                        Comments ({allComments.length})
                    </button>
                </div>
        
                {/* Comments Section */}
                {showComments && (
                    <div className="bg-gray-50 p-4 rounded-md mt-3">
                        {allComments.map((comment, index) => (
                            <React.Fragment key={index}>
                                <CommentCard
                                    authorName={comment.authorName}
                                    profilePicture={comment.profilePicture || ""}
                                    content={comment.content}
                                    dateCreated={comment.dateCreated}
                                />
                                {index < allComments.length - 1 && (
                                    <hr className="border-t border-gray-200 my-0.5" />
                                )}
                            </React.Fragment>
                        ))}
            
                        {/* Add Comment Input */}
                        <div className="mt-4">
                            <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            rows={3}
                            />
                            <button
                            onClick={handleAddComment}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md text-sm"
                            >
                                Post Comment
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostCard;