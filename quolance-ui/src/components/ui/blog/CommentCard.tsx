"use client";
import React, {useState} from "react";
import Image from "next/image";
import icon from "@/public/images/freelancer_default_icon.png";
import {useGetFreelancerProfile} from "@/api/freelancer-api";
import {showToast} from "@/util/context/ToastProvider";
import {useDeleteComment, useUpdateComment} from "@/api/blog-api";
import {useAuthGuard} from "@/api/auth-api";
import { useQueryClient } from "@tanstack/react-query";


interface CommentCardProps {
  commentId: string;
  blogPostId: string;
  authorName: string;
  content: string;
  dateCreated: string;
}

const CommentCard: React.FC<CommentCardProps> = ({
  commentId,
  blogPostId,
  authorName,
  content,
  dateCreated,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [currentContent, setCurrentContent] = useState(content);

  const { data: authorProfile } = useGetFreelancerProfile(authorName);
  const { user } = useAuthGuard({ middleware: "auth" });
  const queryClient = useQueryClient();
  
  const { mutate: deleteComment } = useDeleteComment({
    onSuccess: () => {
      showToast("Comment deleted successfully!", "success");
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: () => {
      showToast("Error deleting comment.", "error");
    },
  });

  const { mutateAsync: updateComment } = useUpdateComment({
    onSuccess: (_, updatedComment) => {
      queryClient.invalidateQueries({ queryKey: ["comments", updatedComment.blogPostId] });
  
      setIsEditing(false);
    },
  });

  const handleSave = async () => {
    if (editedContent.trim() === content) {
      setIsEditing(false);
      return;
    }

    try {
      await updateComment({ commentId, content: editedContent, blogPostId });

      setCurrentContent(editedContent);
    
      showToast("Comment updated successfully!", "success");
      setIsEditing(false);
    } catch (error) {
      showToast("Error updating comment.", "error");
    }
  };
  

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleDeleteComment = (commentId: string) => {
    if(confirm("Are you sure you want to delete this comment?")) {
      deleteComment(commentId);
    }
  }

  return (
    <div className="flex items-start md:gap-4 md:px-3 py-2 w-full">
      <div className="flex-1">
        <div className="flex gap-5 items-center">
          {/* User Profile Picture */}
          <Image
            alt={`${authorName}'s profile`}
            src={authorProfile?.profileImageUrl || icon}
            width={24}
            height={24}
            className="w-8 h-8 rounded-full object-cover"
          />
          <p className="text-sm font-semibold text-gray-800 font-sans">{authorName}</p>
          <span className="text-xs text-gray-500">
            {new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            }).format(new Date(dateCreated))}
          </span>
        </div>
        
        
        {/* Comment Content */}
        <div className="flex justify-between mt-2 gap-2">
          {isEditing ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-2 border rounded-md mt-2 text-sm"
              placeholder="Edit you comment..."
            />
          ):(
            <p className="text-sm text-gray-700 mt-1 break-all overflow-hidden w-full">
              {currentContent.length > 150 && !isExpanded
                ? `${currentContent.substring(0, 150)}...`
                : currentContent}
              {currentContent.length > 150 && (
                <button
                  onClick={toggleExpand}
                  className="text-blue-500 text-xs ml-1 hover:underline"
                >
                  {isExpanded ? "Show less" : "Show more"}
                </button>
              )}
          </p>
          )}
          
          {user?.username === authorName && (
            <>
              <span className="text-xs text-blue-500 cursor-pointer mt-2" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Cancel" : "Edit"}
              </span>
              {isEditing ? (
                <span className="text-xs text-blue-500 cursor-pointer mt-2" onClick={handleSave}> Save </span>
              ):(
                <span className="text-xs text-red-500 cursor-pointer mt-2" onClick={() => handleDeleteComment(commentId)}> Delete </span>
              )}
              
            </>
          )} 
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
