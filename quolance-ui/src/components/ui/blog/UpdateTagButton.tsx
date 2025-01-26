import React, { useState } from "react";
import { useUpdateTagsForPost } from "@/api/blog-api";
import { BlogTags } from "@/constants/types/blog-tags";

interface UpdateTagsButtonProps {
  postId: number; // ID of the blog post
  currentTags: string[]; // Current tags of the blog post
  onUpdateTags: (updatedTags: string[]) => void; // Callback to update tags in parent
}

const UpdateTagsButton: React.FC<UpdateTagsButtonProps> = ({ postId, currentTags, onUpdateTags }) => {
  const [tagsInput, setTagsInput] = useState<string>(""); // For user input
  const [localTags, setLocalTags] = useState<string[]>(currentTags); // Local tag state for display

  const { mutate: updateTags, status } = useUpdateTagsForPost({
    onSuccess: (updatedTags) => {
      setLocalTags(updatedTags); // Update local tags only if API succeeds
      onUpdateTags(updatedTags); // Notify parent component about the update
      setTagsInput(""); // Clear the input field
    },
    onError: (error) => {
      alert(`Failed to update tags: ${error.message}`);
    },
  });

  // Corrected isLoading logic
  const isLoading = status === "pending";

  const handleUpdateTags = () => {
    const newTags = tagsInput.split(",").map((tag) => tag.trim().toUpperCase());
    const validTags = newTags.filter((tag) => Object.values(BlogTags).includes(tag as BlogTags));

    if (validTags.length === 0) {
      alert("Please enter valid tags.");
      return;
    }

    updateTags({ postId, tags: validTags });
  };

  return (
    <div className="p-4 border rounded-md shadow-sm bg-gray-50">
      {/* Display current tags */}
      <div className="mb-2">
        <h4 className="font-semibold">Current Tags:</h4>
        <div className="flex gap-2 flex-wrap mt-1">
          {localTags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Input to add tags */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Enter tags (comma-separated)"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-md text-sm"
        />
        <button
          onClick={handleUpdateTags}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm disabled:bg-blue-300"
        >
          {isLoading ? "Updating..." : "Update Tags"}
        </button>
      </div>
    </div>
  );
};

export default UpdateTagsButton;