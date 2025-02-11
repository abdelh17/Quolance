"use client";
import React, {useState} from "react";
import Image from "next/image";
import icon from "@/public/images/freelancer_default_icon.png";
import {useGetFreelancerProfile} from "@/api/freelancer-api";
import {showToast} from "@/util/context/ToastProvider";
import {useDeleteComment} from "@/api/blog-api";
import {useAuthGuard} from "@/api/auth-api";


interface CommentCardProps {
  commentId: string;
  authorName: string;
  content: string;
  dateCreated: string;
}

const CommentCard: React.FC<CommentCardProps> = ({
  commentId,
  authorName,
  content,
  dateCreated,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: authorProfile } = useGetFreelancerProfile(authorName);
  const { user } = useAuthGuard({ middleware: "auth" });
  
  const { mutate: deleteComment } = useDeleteComment({
    onSuccess: () => {
      showToast("Comment deleted successfully!", "success");
      window.location.reload(); // Refresh page to reflect deletion
    },
    onError: () => {
      showToast("Error deleting comment.", "error");
    },
  })

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleDeleteComment = (commentId: string) => {
    if(confirm("Are you sure you want to delete this comment?")) {
      deleteComment(commentId);
    }
  }

  // Temporary until comment endpoint returns authorName instead of authorId
  const tempUserName = "User #" + user?.id;

  return (
    <div className="flex items-start gap-4 py-1.5">
      {/* User Profile Picture */}
      <Image
        alt={`${authorName}'s profile`}
        src={authorProfile?.profileImageUrl || icon}
        width={32}
        height={32}
        className="rounded-full object-cover"
      />

      {/* Comment Content */}
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold text-gray-800">{authorName}</p>
          <span className="text-xs text-gray-500">
            {new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }).format(new Date(dateCreated))}
          </span>
        </div>

        <div className="flex justify-between">
          <p className="text-sm text-gray-700 mt-1">
            {content.length > 150 && !isExpanded
              ? `${content.substring(0, 150)}...`
              : content}
            {content.length > 150 && (
              <button
                onClick={toggleExpand}
                className="text-blue-500 text-xs ml-1 hover:underline"
              >
                {isExpanded ? "Show less" : "Show more"}
              </button>
            )}
          </p>
          {/* {user?.username === authorName && (
            <span className="text-xs text-red-500 cursor-pointer mt-2" onClick={() => handleDeleteComment(commentId)}> Delete </span>
          )} */}
          {/* temporary, must use above once comment endpoint returns authorName instead of authorId */}
          {tempUserName === authorName && (
            <span className="text-xs text-red-500 cursor-pointer mt-2" onClick={() => handleDeleteComment(commentId)}> Delete </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
