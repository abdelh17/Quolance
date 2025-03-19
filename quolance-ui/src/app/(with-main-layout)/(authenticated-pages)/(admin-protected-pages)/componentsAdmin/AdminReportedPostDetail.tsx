"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import icon from "@/public/images/freelancer_default_icon.png";
import PostReaction from "@/components/ui/blog/PostReaction";
import CommentCard from "@/components/ui/CommentCard";
import UserSummary from "@/components/ui/blog/UserSummary";
import { useAuthGuard } from "@/api/auth-api";
import { useGetFreelancerProfile } from "@/api/freelancer-api";
import {
  useGetCommentsByPostId,
  useGetReactionsByPostId,
} from "@/api/blog-api";
import { showToast } from "@/util/context/ToastProvider";
import { useQueryClient } from "@tanstack/react-query";

import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { Button } from "@/components/ui/button";
import httpClient from "@/lib/httpClient"; // for admin "keep" or "delete" calls
import { PaginationParams } from "@/constants/types/pagination-types";

interface ReactionState {
  [key: string]: { count: number; userReacted: boolean };
}

interface AdminReportedPostDetailProps {
  id: string;
  title: string;
  content: string;
  authorName: string;
  dateCreated: string;
  tags?: string[];
  imageUrls?: string[];
  hideKeep?: boolean;
}

const AdminReportedPostDetail: React.FC<AdminReportedPostDetailProps> = ({
  id,
  title,
  content,
  authorName,
  dateCreated,
  tags = [],
  imageUrls = [],
  hideKeep = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [reactions, setReactions] = useState<ReactionState | null>(null);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [allLoadedComments, setAllLoadedComments] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationParams>({ page: 0, size: 5 });

  const [userSummaryPosition, setUserSummaryPosition] = useState<{ x: number; y: number } | null>(null);
  const [openUserSummaryPostId, setOpenUserSummaryPostId] = useState<string | null>(null);
  const isUserSummaryOpen = openUserSummaryPostId === id;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user } = useAuthGuard({ middleware: "auth" });
  const { data: authorProfile } = useGetFreelancerProfile(authorName);
  const { data: reactionData } = useGetReactionsByPostId(id);
  const { data: pagedComments } = useGetCommentsByPostId(id, pagination);

  const queryClient = useQueryClient();

  const userSummaryRef = useRef<HTMLDivElement | null>(null);
  const profileImageRef = useRef<HTMLImageElement | null>(null);
  const authorNameRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (pagedComments?.content) {
      setAllLoadedComments((prev) => {
        const newComments = pagedComments.content.filter(
          (c) => !prev.some((existing) => existing.commentId === c.commentId)
        );
        return [...prev, ...newComments];
      });
    }
  }, [pagedComments]);

  useEffect(() => {
    if (!reactionData) return;
    const initialReactions: ReactionState = {
      like: { count: 0, userReacted: false },
      love: { count: 0, userReacted: false },
      haha: { count: 0, userReacted: false },
      wow: { count: 0, userReacted: false },
      sad: { count: 0, userReacted: false },
      angry: { count: 0, userReacted: false },
    };

    reactionData.forEach((r) => {
      const lower = r.reactionType.toLowerCase();
      if (initialReactions[lower]) {
        initialReactions[lower].count += 1;
        if (r.userName === user?.username) {
          initialReactions[lower].userReacted = true;
        }
      }
    });

    setReactions(initialReactions);
  }, [reactionData, user]);

  useEffect(() => {
    const handleCloseUserSummary = (event: MouseEvent) => {
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
    };

    if (isUserSummaryOpen) {
      document.addEventListener("mousedown", handleCloseUserSummary);
    }
    return () => {
      document.removeEventListener("mousedown", handleCloseUserSummary);
    };
  }, [isUserSummaryOpen]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleKeepPost = async () => {
    if (hideKeep) return;
    try {
      await httpClient.post(`/api/admin/blog-posts/reported/${id}/keep`);
      showToast("Blog post was kept (resolved) successfully", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to keep post", "error");
    }
  };

  const handleDeletePost = async () => {
    if (!confirm("Are you sure you want to delete this reported post?")) return;
    try {
      await httpClient.delete(`/api/admin/blog-posts/reported/${id}`);
      showToast("Blog post deleted successfully", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to delete post", "error");
    }
  };


  const handleShowUserSummary = (event: React.MouseEvent<HTMLElement>) => {
    if (isUserSummaryOpen) {
      setOpenUserSummaryPostId(null);
      setUserSummaryPosition(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      setOpenUserSummaryPostId(id);
      setUserSummaryPosition({
        x: rect.left - 25 + window.scrollX,
        y: rect.top - 50 + window.scrollY,
      });
    }
  };

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const toggleComments = () => setShowComments(!showComments);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setShowFullScreen(true);
  };
  const closeFullScreen = () => setShowFullScreen(false);
  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);

  const handleLoadMoreComments = () => {
    if (!pagedComments) return;
    if (pagedComments.number < (pagedComments.totalPages ?? 1) - 1) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  return (
    <div className="bg-white shadow-md rounded-md font-sans">
      <div className="flex justify-between bg-n20 w-full rounded-t-md">
        <div className="flex items-center mb-2 mt-2 ml-5 py-3">
          <Image
            ref={profileImageRef}
            alt={`${authorName}'s profile`}
            src={icon}
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
                left: userSummaryPosition.x,
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
                {!hideKeep && (
                    <button
                    onClick={handleKeepPost}
                    className="text-gray-800 text-sm hover:bg-gray-100 text-left w-full"
                    >
                    <div className="mt-2 ml-2 mb-1">Keep</div>
                    </button>
                )}
                <button
                    onClick={handleDeletePost}
                    className="text-gray-800 text-sm hover:bg-gray-100 text-left w-full"
                >
                    <div className="mb-2 ml-2">Delete</div>
                </button>
                </div>
            )}
            </div>
            </span>
      </div>

      {/* ---------- IMAGES SECTION ---------- */}
      <div className="m-5">
        {imageUrls.length > 0 && (
          <div
            className={`mt-4 ${
              imageUrls.length === 3
                ? "grid grid-rows-2 gap-2"
                : imageUrls.length > 1
                ? "grid grid-cols-2 gap-2"
                : ""
            }`}
          >
            {/* 1 image full width */}
            {imageUrls.length === 1 && (
              <div
                onClick={() => handleImageClick(0)}
                className="w-full bg-gray-100 rounded-md cursor-pointer overflow-hidden"
                style={{ height: "32rem" }}
              >
                <img
                  src={imageUrls[0]}
                  alt="Single image"
                  className="object-cover w-full h-full"
                />
              </div>
            )}

            {/* 2 images */}
            {imageUrls.length === 2 &&
              imageUrls.map((url, index) => (
                <div
                  key={index}
                  onClick={() => handleImageClick(index)}
                  className="w-full bg-gray-100 rounded-md cursor-pointer overflow-hidden"
                  style={{ height: "32rem" }}
                >
                  <img
                    src={url}
                    alt={`Image ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}

            {/* 3 images */}
            {imageUrls.length === 3 && (
              <>
                <div
                  onClick={() => handleImageClick(0)}
                  className="w-full bg-gray-100 rounded-md cursor-pointer overflow-hidden"
                  style={{ height: "16rem" }}
                >
                  <img
                    src={imageUrls[0]}
                    alt="Full-width"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {imageUrls.slice(1, 3).map((url, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleImageClick(idx + 1)}
                      className="w-full bg-gray-100 rounded-md cursor-pointer overflow-hidden"
                      style={{ height: "16rem" }}
                    >
                      <img
                        src={url}
                        alt={`Image ${idx + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* 4+ images */}
            {imageUrls.length > 3 &&
              imageUrls.slice(0, 4).map((url, index) => (
                <div
                  key={index}
                  onClick={() => handleImageClick(index)}
                  className="relative w-full bg-gray-100 rounded-md cursor-pointer overflow-hidden"
                  style={{ height: "16rem" }}
                >
                  <img src={url} alt={`Img ${index + 1}`} className="object-cover w-full h-full" />
                  {index === 3 && imageUrls.length > 4 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <p className="text-white text-sm font-bold">VIEW MORE</p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}

        {/* ---------- FULL-SCREEN IMAGE VIEWER ---------- */}
        {showFullScreen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative w-3/4 h-3/4 bg-zinc-800 rounded-md overflow-hidden bg-opacity-50">
              <div className="absolute top-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded-md text-sm font-semibold">
                {currentImageIndex + 1} / {imageUrls.length}
              </div>

              <button
                onClick={closeFullScreen}
                className="absolute top-2 right-2 text-white bg-red-500 p-2 rounded-full"
              >
                X
              </button>

              <img
                src={imageUrls[currentImageIndex]}
                alt="Full view"
                className="w-full h-full object-contain"
              />

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
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-500 text-sm mt-2 focus:outline-none"
          >
            {isExpanded ? "Read less" : "Read more"}
          </button>
        )}

        {tags.length > 0 && (
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

        <div className="mt-4 flex items-center gap-1">
          {reactions &&
            Object.keys(reactions).map((reaction) => {
              return (
                <PostReaction
                  key={reaction}
                  reaction={reaction}
                  reactionCount={reactions[reaction].count}
                  userReaction={reactions[reaction].userReacted}
                  onReactionClick={() => {
                  }}
                />
              );
            })}
        </div>

        <button
          onClick={toggleComments}
          className="text-blue-500 text-sm focus:outline-none mt-3 mb-3"
        >
          {pagedComments?.totalElements ?? 0} Comments{" "}
          {showComments ? (
            <MdExpandLess className="inline-block text-xl" />
          ) : (
            <MdExpandMore className="inline-block text-xl" />
          )}
        </button>

        {showComments && (
          <div className="md:mx-2 md:px-3 border-solid border-2 shadow-md mb-2 p-3 rounded-md">
            {allLoadedComments.map((comment) => (
              <CommentCard
                key={comment.commentId}
                name={comment.username}
                comment={comment.content}
                img={icon}
                location=""
              />
            ))}

            {pagedComments &&
              pagedComments.number < (pagedComments.totalPages ?? 1) - 1 && (
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

          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReportedPostDetail;
