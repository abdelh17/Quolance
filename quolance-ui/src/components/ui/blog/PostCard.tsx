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
  
    const toggleExpand = () => setIsExpanded(!isExpanded);
  
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
