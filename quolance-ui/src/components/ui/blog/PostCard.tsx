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
  CommentResponseDto,
  useAddComment,
  useDeleteBlogPost,
  useGetCommentsByPostId,
  useGetReactionsByPostId,
  useReactToPost,
  useRemoveReaction,
  useReportBlogPost
} from "@/api/blog-api";
import {showToast} from "@/util/context/ToastProvider";
import { PaginationParams } from "@/constants/types/pagination-types";
import { Button } from "../button";
import { IoSendSharp } from 'react-icons/io5'
import { MdExpandMore, MdExpandLess } from 'react-icons/md'
import { useQueryClient } from "@tanstack/react-query";

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
}

const PostCard: React.FC<PostCardProps> = ({ id, title, content, authorName, dateCreated, tags, imageUrls = [], openUserSummaryPostId, setOpenUserSummaryPostId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState<string>("");
  const [reactions, setReactions] = useState<ReactionState | null>(null);
  const [showFullScreen, setShowFullScreen] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [allLoadedComments, setAllLoadedComments] = useState<CommentResponseDto[]>([]);

  const [userSummaryPosition, setUserSummaryPosition] = useState<{ x: number; y: number } | null>(null);
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
        setUserSummaryPosition(null);
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
      setUserSummaryPosition(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();

      setUserSummaryPosition({
        x: rect.left - 25 + window.scrollX,
        y: rect.top - 50 + window.scrollY
      });
      setOpenUserSummaryPostId(id);
    }
  };

  const handleDeletePost = (postId: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      deletePost(postId);
    }
  };

  const handleEdit = () => {console.log("Edit post")};

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
    <div className="bg-white shadow-md rounded-md font-sans">
      {/* User Info */}
      <div className="flex justify-between bg-n20 w-full rounded-t-md">
        <div className="flex items-center mb-2 mt-2 ml-5 py-3">
          <Image
            ref={profileImageRef}
            alt={`${authorName}'s profile`}
            src={authorProfile?.profileImageUrl || icon}
            width={56}
            height={56}
            className="rounded-full object-cover cursor-pointer"
            onClick={handleShowUserSummary}
          />
          <button
            ref={authorNameRef}
            className="ml-4 text-gray-800 font-bold cursor-pointer focus:outline-none"
            onClick={handleShowUserSummary}
          >
            {authorName}
          </button>
          {isUserSummaryOpen && userSummaryPosition && (
            <div
              ref={userSummaryRef}
              className="absolute z-50"
              style={{
                top: userSummaryPosition.y,
                left: userSummaryPosition.x
              }}
            >
              {authorProfile && <UserSummary user={authorProfile} />}
            </div>
          )}
        </div>
        <span className="text-sm text-gray-500 mr-5 mt-3">
          <div ref={menuRef} className="relative">
            <Button
              onClick={toggleMenu}
              className="focus:outline-none text-2xl font-bold mt-2"
              variant="ghost"
            >
              ...
            </Button>
            {isMenuOpen && (
              <div className="absolute top-8 right-0 bg-white shadow-md rounded-md mt-5 mr-3 w-28 flex flex-col gap-1">
                {user?.username === authorName ? (
                  <>
                    <button 
                      onClick={handleEdit} 
                      className="text-gray-800 text-sm hover:bg-gray-100 text-left w-full"
                    >
                      <div className="mt-2 ml-2">
                        Edit
                      </div>
                    </button>
                    <button
                        onClick={() => handleDeletePost(id)}
                        className="text-gray-800 text-sm hover:bg-gray-100 text-left w-full "
                    >
                      <div className="ml-2 mb-2">
                        Delete
                      </div>
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={handleReport} 
                    className="text-gray-800 text-sm hover:bg-gray-100 text-left w-full"
                  >
                    <div className="mt-2 ml-2 mb-2">
                      Report
                    </div>
                  </button>
                )
              }
              </div>
            )}
          </div>
          
        </span>
      </div>
      <div className="m-5">
        {/* Post Images */}
        {imageUrls.length > 0 && (
          <div className={`mt-4 ${imageUrls.length === 3 ? 'grid grid-rows-2 gap-2' : imageUrls.length > 1 ? 'grid grid-cols-2 gap-2' : ''}`}>
            {/* Full-width layout for 1 image */}
            {imageUrls.length === 1 && (
              <div
                  onClick={() => handleImageClick(0)}
                  className="w-full bg-gray-100 rounded-md cursor-pointer overflow-hidden"
                  style={{ height: '32rem' }} // dynamically forcing h-128 height
              >
                <img src={imageUrls[0]} alt="Single image" className="object-cover w-full h-full" />
              </div>
            )}

            {imageUrls.length === 2 && (
              imageUrls.map((url, index) => (
                <div
                  key={index}
                  onClick={() => handleImageClick(index)}
                  className="w-full bg-gray-100 rounded-md cursor-pointer overflow-hidden"
                  style={{ height: '32rem' }} // dynamically forcing h-128 height
                >
                  <img src={url} alt={`Image ${index + 1}`} className="object-cover w-full h-full" />
                </div>
              ))
            )}

            {/* 3 images: First image full width, next two side by side */}
            {imageUrls.length === 3 && (
              <>
                <div
                  onClick={() => handleImageClick(0)}
                  className="w-full bg-gray-100 rounded-md cursor-pointer overflow-hidden"
                  style={{ height: '16rem' }} // dynamically forcing h-128 height
                >
                  <img src={imageUrls[0]} alt="Full-width image" className="object-cover w-full h-full" />

                </div>
                <div className="grid grid-cols-2 gap-2">
                  {imageUrls.slice(1, 3).map((url, index) => (
                    <div
                      key={index}
                      onClick={() => handleImageClick(index + 1)}
                      className="w-full bg-gray-100 rounded-md cursor-pointer overflow-hidden"
                      style={{ height: '16rem' }} // dynamically forcing h-128 height
                    >
                      <img src={url} alt={`Image ${index + 1}`} className="object-cover w-full h-full" />
                    </div>
                  ))}
                </div>
              </>
            )}
            {/* 4 images and more*/}
            {imageUrls.length > 3 && (
              imageUrls.slice(0, 4).map((url, index) => (
                <div
                  key={index}
                  onClick={() => handleImageClick(index)}
                  className="relative w-full bg-gray-100 rounded-md cursor-pointer overflow-hidden"
                  style={{ height: '16rem' }} // dynamically forcing h-128 height
                >
                  <img src={url} alt={`Image ${index + 1}`} className="object-cover w-full h-full" />


                  {index === 3 && imageUrls.length > 3 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <p className="text-white text-sm font-bold">VIEW MORE</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Full-screen image viewer */}
        {showFullScreen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative w-3/4 h-3/4 bg-zinc-800 rounded-md overflow-hidden bg-opacity-50">
              {/* Image Index Indicator */}
              <div className="absolute top-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded-md text-sm font-semibold">
                {currentImageIndex + 1} / {imageUrls.length}
              </div>

              {/* Close button */}
              <button
                onClick={closeFullScreen}
                className="absolute top-2 right-2 text-white bg-red-500 p-2 rounded-full"
              >
                X
              </button>

              <img src={imageUrls[currentImageIndex]} alt="Full view" className="w-full h-full object-contain" />

              {/* Navigation buttons */}
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white p-2 rounded-md"
              >
                &lt;
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white p-2 rounded-md"
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="md:pb-5 md:px-8 px-2 pb-0.5">
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

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-semibold">
                {tag.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
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
        <button
          onClick={toggleComments}
          className="text-blue-500 text-sm focus:outline-none mt-3 mb-3"
        >
          {pagedComments?.totalElements ?? 0} Comments {showComments ? <MdExpandLess className="inline-block text-xl"/> : <MdExpandMore className="inline-block text-xl"/>}
        </button>

        {/* Comments Section */}
        <div className="md:mx-2 md:px-3">
          {showComments && (
            <div className="border-solid border-2 shadow-md mb-2 p-3 rounded-md content-center">
              {allLoadedComments.map((comment) => (
                <CommentCard
                  key={comment.commentId}
                  commentId={comment.commentId}
                  authorName={comment.username}
                  content={comment.content}
                  dateCreated={new Date().toISOString()}
                />
              ))}
              {(pagedComments?.number ?? 0) < ((pagedComments?.totalPages ?? 1) - 1) && (
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
              <div className="mt-4 flex flex-row justify-between gap-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full h-10 p-2 border border-gray-300 rounded-md text-sm"
                  rows={3}
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
    </div>
  );
};

export default PostCard;