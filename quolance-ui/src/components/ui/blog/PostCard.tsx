"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import icon from "@/public/images/freelancer_default_icon.png";
import PostReaction from "./PostReaction";
import { useGetReactionsByPostId, useReactToPost, useGetCommentsByPostId, useAddComment } from "@/api/blog-api";
import { useAuthGuard } from "@/api/auth-api";
import CommentCard from "./CommentCard";
import { CommentType } from "@/constants/types/blog-types";
import { useGetFreelancerProfile } from "@/api/freelancer-api";
import UserSummary from "@/components/ui/blog/UserSummary";

interface ReactionState {
    [key: string]: { count: number; userReacted: boolean };
}

interface PostCardProps {
    id: number;
    title: string;
    content: string;
    authorName: string;
    dateCreated: string;
    }

const PostCard: React.FC<PostCardProps> = ({ id, title, content, authorName, dateCreated }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState<string>("");
    const [reactions, setReactions] = useState<ReactionState | null>(null);
    const [showUserSummary, setShowUserSummary] = useState(false);
    const [userSummaryPosition, setUserSummaryPosition] = useState<{ x: number; y: number } | null>(null);

    const { user } = useAuthGuard({ middleware: "auth" });
    const { data: authorProfile } = useGetFreelancerProfile(authorName);

    const { data: reactionData } = useGetReactionsByPostId(id);
    const { mutate: reactToPost } = useReactToPost();
    
    const { data: commentsData, refetch: refetchComments } = useGetCommentsByPostId(id);
    const { mutate: addComment } = useAddComment(id, {
        onSuccess: () => {
            setNewComment("");
            refetchComments();
        },
    });
    
    useEffect(() => {
    if (reactionData) {
        const initialReactions: ReactionState = {
            like: { count: 0, userReacted: false },
            love: { count: 0, userReacted: false },
            haha: { count: 0, userReacted: false },
            wow: { count: 0, userReacted: false },
            sad: { count: 0, userReacted: false },
            angry: { count: 0, userReacted: false },
        };

        reactionData.forEach((reaction) => {
        const { reactionType, userName } = reaction;
        initialReactions[reactionType.toLowerCase()].count += 1;
        if (userName === user?.username) {
            initialReactions[reactionType.toLowerCase()].userReacted = true;
        }
        });

        setReactions(initialReactions);
    }
    }, [reactionData, user]);

    const handleReactionClick = (reactionType: string) => {
        if (!reactions) return;

        const userReacted = reactions[reactionType].userReacted;

        const updatedReactions = Object.keys(reactions).reduce((acc, key) => {
            acc[key] = { ...reactions[key] };

            if (key === reactionType) {
            acc[key].userReacted = !userReacted;
            acc[key].count += userReacted ? -1 : 1;
            } else if (reactions[key].userReacted) {
            acc[key].userReacted = false;
            acc[key].count -= 1;
            }

            return acc;
        }, {} as ReactionState);

        setReactions(updatedReactions);
        reactToPost({ reactionType: reactionType.toUpperCase(), blogPostId: id });
    };

    const handleAddComment = () => {
        if (!newComment.trim() || !user) return;

        addComment({ content: newComment });
    };

    const handleShowUserSummary = (event: React.MouseEvent<HTMLDivElement>) => {
        setShowUserSummary(!showUserSummary);
        setUserSummaryPosition({
            x: event.pageX - 200,
            y: event.pageY - 250,
        });
    };

    const toggleExpand = () => setIsExpanded(!isExpanded);
    const toggleComments = () => setShowComments(!showComments);

    return (
        <div className="bg-white shadow-md rounded-md">
            {/* User Info */}
            <div className="bg-slate-300 w-full rounded-t-md">
                <div className="flex items-center mb-4 ml-5 py-5">
                    {showUserSummary && userSummaryPosition && (
                        <div
                            className="absolute shadow-md rounded-md"
                            style={{
                                top: `${userSummaryPosition.y}px`,
                                left: `${userSummaryPosition.x}px`,
                            }}
                        >
                            <UserSummary user={authorProfile} />
                        </div>
                    )}
                    <Image
                        alt={`${authorName}'s profile`}
                        src={authorProfile?.profileImageUrl || icon}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                        onClick={handleShowUserSummary}
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

            {/* Reaction Buttons */}
            <div className="mt-4 flex items-center gap-1">
                {reactions &&
                Object.keys(reactions).map((reaction) => (
                    <PostReaction
                    key={reaction}
                    reaction={reaction}
                    reactionCount={reactions[reaction].count}
                    userReaction={reactions[reaction].userReacted}
                    onReactionClick={() => handleReactionClick(reaction)}
                    />
                ))}
            </div>

            {/* Comments Section */}
            <div className="mt-4">
                <button
                    onClick={toggleComments}
                    className="text-blue-500 text-sm focus:outline-none"
                >
                    Comments ({commentsData?.length || 0})
                </button>

                {showComments && (
                <div className="bg-gray-50 p-4 rounded-md mt-3">
                    {commentsData?.map((comment) => (
                        <CommentCard
                            key={comment.commentId}
                            authorName={`User #${comment.userId}`}
                            content={comment.content}
                            dateCreated={new Date().toISOString()}
                        />
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
        </div>
    );
};

export default PostCard;