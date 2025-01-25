"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import icon from "@/public/images/freelancer_default_icon.png";
import PostReaction from "./PostReaction";
import { useGetReactionsByPostId, useReactToPost } from "@/api/blog-api";
import { useAuthGuard } from "@/api/auth-api";

interface ReactionState {
    [key: string]: { count: number; userReacted: boolean };
  }
  
  interface PostCardProps {
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
  }
  
  const PostCard: React.FC<PostCardProps> = ({
    id,
    title,
    content,
    authorName,
    dateCreated,
  }) => {
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
    const [reactions, setReactions] = useState<ReactionState | null>(null);
  
    const { data: reactionData } = useGetReactionsByPostId(id);
    const { mutate: reactToPost } = useReactToPost();
    const { user } = useAuthGuard({ middleware: "auth" });
  
    // Initialize reactions when data is fetched
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
          if (userName === user?.username) { // Mark as filled if reacted by current user
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
  
      // Post the reaction to the backend
      reactToPost({ reactionType: reactionType.toUpperCase(), blogPostId: id });
    };
  
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
        </div>
      </div>
    );
  };
  
  export default PostCard;