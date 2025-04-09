"use client";

import React, {useEffect, useRef, useState} from "react";
import Image from "next/image";
import icon from "@/public/images/freelancer_default_icon.png";
import PostReaction from "./PostReaction";

import {useAuthGuard} from "@/api/auth-api";
import CommentCard from "./CommentCard";
import {useGetFreelancerProfile} from "@/api/freelancer-api";
import UserSummary from "@/components/ui/blog/UserSummary";
import {
  useAddComment,
  useDeleteBlogPost,
  useGetCommentsByPostId,
  useGetReactionsByPostId,
  useReactToPost,
  useRemoveReaction,
  useReportBlogPost
} from "@/api/blog-api";
import { CommentResponseDto } from "@/constants/types/blog-types";
import {showToast} from "@/util/context/ToastProvider";
import { PaginationParams } from "@/constants/types/pagination-types";
import { Button } from "../button";
import { IoSendSharp } from 'react-icons/io5'
import { MdExpandMore, MdExpandLess } from 'react-icons/md'
import { useQueryClient } from "@tanstack/react-query";
import CreatePostModal from "./CreatePostModal";
import CreatePostForm from "./CreatePostForm";

interface ReactionState {
  [key: string]: { count: number; userReacted: boolean };
}

interface PostCardProps {
  id: string;
  title: string;
  content: string;
  authorName: string;
  dateCreated: string;
  tags?: string[];
  imageUrls?: string[];
  openUserSummaryPostId: string | null;
  setOpenUserSummaryPostId: (open: string | null) => void;
  onSubmit: (postData: {
    id?: string;
    title: string;
    content: string;
    tags: string[];
    files?: File[]
  }) => void;
}

const PostCard: React.FC<PostCardProps> = ({ id, title, content, authorName, dateCreated, tags, imageUrls = [], openUserSummaryPostId, setOpenUserSummaryPostId, onSubmit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState<string>("");
  const [reactions, setReactions] = useState<ReactionState | null>(null);
  const [showFullScreen, setShowFullScreen] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [allLoadedComments, setAllLoadedComments] = useState<CommentResponseDto[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<PostCardProps | null>(null);

  const [pagination, setPagination] = useState<PaginationParams>({page: 0, size: 5});
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user } = useAuthGuard({ middleware: "auth" });
  const { data: authorProfile } = useGetFreelancerProfile(authorName);

  const queryClient = useQueryClient();
  const { data: reactionData } = useGetReactionsByPostId(id);
  const { mutate: reactToPost } = useReactToPost();

  const { data: pagedComments } = useGetCommentsByPostId(id, pagination);
  const { mutate: addComment } = useAddComment(id, {
    onSuccess: () => {
      setNewComment(""); 
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
    },
  });
  

  const { mutate: removeReaction } = useRemoveReaction();
  const { mutate: deletePost } = useDeleteBlogPost({
    onSuccess: () => {
      showToast("Post deleted successfully!", "success");
      queryClient.invalidateQueries({ queryKey: ["all-blog-posts"] }); // Re-fetch posts
    },
    onError: () => {
      showToast("Error deleting post.", "error");
    },
  });

  const userSummaryRef = useRef<HTMLDivElement | null>(null);
  const profileImageRef = useRef<HTMLImageElement | null>(null);
  const authorNameRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const isUserSummaryOpen = openUserSummaryPostId === id;

  useEffect(() => {
    if (pagedComments?.content) {
      setAllLoadedComments((prevComments) => {
        const newComments = pagedComments.content.filter(
          (newComment) => !prevComments.some((prevComment) => prevComment.commentId === newComment.commentId)
        );
        return [...prevComments, ...newComments];
      });
    }
  }, [pagedComments]);
  

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

  useEffect(() => {
    function handleCloseUserSummary(event: MouseEvent) {
      if (
        userSummaryRef.current &&
        !userSummaryRef.current.contains(event.target as Node) &&
        profileImageRef.current &&
        !profileImageRef.current.contains(event.target as Node) &&
        authorNameRef.current &&
        !authorNameRef.current.contains(event.target as Node)
      ) {
        setOpenUserSummaryPostId(null);
      }
    }

    if (isUserSummaryOpen) {
      document.addEventListener("mousedown", handleCloseUserSummary);
    }

    return () => {
      document.removeEventListener("mousedown", handleCloseUserSummary);
    };
  }, [isUserSummaryOpen, setOpenUserSummaryPostId]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }
    
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleReactionClick = (reactionType: string) => {
    if (!reactions || !user) return;

    const userReacted = reactions[reactionType].userReacted;

    if (userReacted) {
      const userReaction = reactionData?.find(
        (reaction) => reaction.reactionType.toLowerCase() === reactionType && reaction.userName === user.username
      );
      
      if (userReaction) {
        removeReaction(userReaction.id);
      }
    } else {
      reactToPost({ reactionType: reactionType.toUpperCase(), blogPostId: id });
    }

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
  };

  const { mutate: reportBlogPost } = useReportBlogPost({
    onSuccess: () => {
      showToast("Post reported successfully!", "success");
      queryClient.invalidateQueries({ queryKey: ["all-blog-posts"] });
    },
    onError: (error) => {
      showToast("Error reporting post", "error");
      console.error(error);
    },
  });

  const handleAddComment = () => {
    if (!newComment.trim() || !user) return;
    addComment({ content: newComment });
  };

  const handleShowUserSummary = (event: React.MouseEvent<HTMLElement>) => {
    if (isUserSummaryOpen) {
      setOpenUserSummaryPostId(null);
    } else {
      setOpenUserSummaryPostId(id);
    }
  };

  const handleDeletePost = (postId: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      deletePost(postId);
    }
  };

  const handleEdit = () => {
    setEditingPost({
      id,
      title,
      content,
      tags,
      imageUrls,
      authorName,
      dateCreated,
      openUserSummaryPostId,
      setOpenUserSummaryPostId,
      onSubmit,
    });
    setIsEditing(true);
  };

  function handleReport() {
    if (!confirm("Are you sure you want to report this post?")) return;
    reportBlogPost(id);
  }

  const handleLoadMoreComments = () => {
    if (!pagedComments || pagedComments.number >= (pagedComments.totalPages ?? 1) - 1) return;
    setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  const toggleExpand = () => setIsExpanded(!isExpanded);
  const toggleComments = () => setShowComments(!showComments);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setShowFullScreen(true);
  };

  const closeFullScreen = () => {
    setShowFullScreen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + imageUrls.length) % imageUrls.length);
  };


  return (
    <div className="bg-white bg-opacity-60 shadow-md rounded-md font-sans p-8">
      {/* User Info + Top Row */}
      <div className="flex justify-between items-start">
        <div className="relative inline-block">
          <button
            ref={authorNameRef}
            className="flex items-center space-x-2"
            onClick={handleShowUserSummary}
          >
            <Image
              ref={profileImageRef}
              src={authorProfile?.profileImageUrl || icon}
              alt="User Profile"
              width={56}
              height={56}
              className="w-14 h-14 rounded-full object-cover"
            />
            <span className="font-semibold text-gray-800">{authorName}</span>
          </button>

          {isUserSummaryOpen && authorProfile && (
            <div
            ref={userSummaryRef}
            className="absolute z-50 -translate-x-4 translate-y-4 md:translate-x-4 md:translate-y-1"
          >
            <UserSummary user={authorProfile} />
          </div>
          
          )}
        </div>
  
        {/* 3-dot Menu */}
        <div ref={menuRef} className="relative">
          <Button
            onClick={toggleMenu}
            className="focus:outline-none text-2xl font-bold"
            variant="ghost"
          >
            ...
          </Button>
          {isMenuOpen && (
            <div className="absolute top-8 right-0 bg-white shadow-md rounded-md w-28 flex flex-col gap-1 z-40">
              {user?.username === authorName ? (
                <>
                  <button
                    onClick={handleEdit}
                    className="text-gray-800 text-sm hover:bg-gray-100 text-left w-full px-3 py-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePost(id)}
                    className="text-gray-800 text-sm hover:bg-gray-100 text-left w-full px-3 py-2"
                  >
                    Delete
                  </button>
                </>
              ) : (
                <button
                  onClick={handleReport}
                  className="text-gray-800 text-sm hover:bg-gray-100 text-left w-full px-3 py-2"
                >
                  Report
                </button>
              )}
            </div>
          )}
          {isEditing && editingPost && (
            <CreatePostModal open={isEditing} onClose={() => setIsEditing(false)}>
              <CreatePostForm
                initialData={editingPost}
                isEditMode={true}
                onSubmit={(postData) => {
                  onSubmit(postData);
                  setIsEditing(false);
                }}
                onClose={() => setIsEditing(false)}
              />
            </CreatePostModal>
          )}
        </div>
      </div>
  
      <div className="flex flex-col md:flex-row md:items-start gap-6 mt-4">
        {/* Title + Content */}
        <div className="flex-1 mt-2 md:mt-0">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">{title}</h3>
          {!isExpanded ? (
            <div className="mt-1 line-clamp-6 md:line-clamp-10">
              <p className="text-gray-700">{content}</p>
            </div>
          ) : (
            <div className="mt-1">
              <p className="text-gray-700">{content}</p>
            </div>
          )}


          {content.length > 800 && (
            <button
              onClick={toggleExpand}
              className="text-blue-500 text-sm mt-2 focus:outline-none"
            >
              {isExpanded ? "Read less" : "Read more"}
            </button>
          )}
  
          
        </div>
  
        {/* Image stack */}
        {imageUrls.length > 0 && (
          <div className="relative w-full md:w-[250px] h-[250px] mb-2 md:mb-0 shrink-0">
            {imageUrls.slice(0, 3).map((url, index) => (
              <div
                key={index}
                onClick={() => handleImageClick(index)}
                className="absolute top-0 left-0 w-[230px] h-[230px] rounded-md overflow-hidden cursor-pointer border transition-transform"
                style={{
                  transform: `translate(${index * 10}px, ${index * 10}px)`,
                  zIndex: 10 - index,
                }}
              >
                <img
                  src={url}
                  alt={`Post image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {index === 2 && imageUrls.length > 3 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-sm font-semibold">
                    +{imageUrls.length - 3}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full-screen viewer */}
      {showFullScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative w-3/4 h-3/4 bg-zinc-800 rounded-md overflow-hidden">
            <button
              onClick={closeFullScreen}
              className="absolute text-4xl w-10 h-10 top-4 right-4 text-white -px-3rounded-md hover:text-red-600 transition"
            >
              ×
            </button>
            <img
              src={imageUrls[currentImageIndex]}
              alt="Full view"
              className="w-full h-full object-contain"
            />
            <button
              onClick={prevImage}
              className="absolute text-6xl left-4 top-1/2 transform -translate-y-1/2 text-white px-3 pb-3 rounded-md hover:text-blue-500 transition"
            >
              &#8249;
            </button>
            <button
              onClick={nextImage}
              className="absolute text-6xl right-4 top-1/2 transform -translate-y-1/2 text-white px-3 pb-3 rounded-md hover:text-blue-500 transition"
            >
              &#8250;
            </button>
            <div className="absolute text-xl bottom-4 left-1/2 transform -translate-x-1/2 bg-b100 bg-opacity-50 text-white px-3 py-1 rounded-md font-medium">
              {currentImageIndex + 1} / {imageUrls.length}
            </div>
          </div>
        </div>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-semibold"
            >
              {tag.replace(/_/g, " ")}
            </span>
          ))}
        </div>
      )}

      {/* Reactions */}
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
      <div className="mt-5">
        <button
          onClick={toggleComments}
          className="text-blue-500 text-sm focus:outline-none mb-3"
        >
          {pagedComments?.totalElements ?? 0} Comments{" "}
          {showComments ? (
            <MdExpandLess className="inline-block text-xl" />
          ) : (
            <MdExpandMore className="inline-block text-xl" />
          )}
        </button>
  
        {showComments && (
          <div className="border-t pt-4">
            {allLoadedComments.map((comment) => (
              <CommentCard
                key={comment.commentId}
                blogPostId={id}
                commentId={comment.commentId}
                authorName={comment.username}
                content={comment.content}
                dateCreated={new Date().toISOString()}
              />
            ))}
  
            {(pagedComments?.number ?? 0) <
              ((pagedComments?.totalPages ?? 1) - 1) && (
              <div className="flex justify-center">
                <Button
                  onClick={handleLoadMoreComments}
                  variant="white"
                  className="mt-2"
                >
                  See More Comments
                </Button>
              </div>
            )}
  
            {/* Add Comment Input */}
            <div className="mt-4 flex items-start gap-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full h-10 p-2 border border-gray-300 rounded-md text-sm"
                rows={2}
              />
              <IoSendSharp
                onClick={handleAddComment}
                className="text-3xl text-blue-600 cursor-pointer mt-1"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;