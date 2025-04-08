'use client';

import React, { useState } from 'react';
import { useAuthGuard } from '@/api/auth-api';
import { Button } from '../button';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../dropdown-menu';
import { useGenerateBlogPost } from '@/api/blog-api';
import AiPromptModal from '@/components/ui/AiPromptModal';

const blogTags = [
  { label: 'Question', value: 'QUESTION' },
  { label: 'Support', value: 'SUPPORT' },
  { label: 'Freelancing', value: 'FREELANCING' },
  { label: 'Skill Matching', value: 'SKILL_MATCHING' },
  { label: 'Remote Work', value: 'REMOTE_WORK' },
  { label: 'AI Suggestions', value: 'AI_SUGGESTIONS' },
  { label: 'Security', value: 'SECURITY' },
  { label: 'Talent Marketplace', value: 'TALENT_MARKETPLACE' },
  { label: 'Global Opportunities', value: 'GLOBAL_OPPORTUNITIES' },
  { label: 'Verified Profiles', value: 'VERIFIED_PROFILES' },
  { label: 'Collaboration Tools', value: 'COLLABORATION_TOOLS' },
  { label: 'Professional Network', value: 'PROFESSIONAL_NETWORK' },
  { label: 'Billing', value: 'BILLING' },
];

interface CreatePostFormProps {
  onSubmit: (postData: { 
    id?: string; 
    title: string; 
    content: string; 
    userId?: string; 
    tags: string[]; 
    files?: File[] 
  }) => void;
  onClose: () => void;
  initialData?: { 
    id: string; 
    title: string; 
    content: string; 
    tags?: string[]; 
    imageUrls?: string[] 
  };
  isEditMode?: boolean;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onSubmit, onClose, initialData, isEditMode }) => {
  const { user } = useAuthGuard({ middleware: 'auth' });
  const [title, setTitle] = useState<string>(initialData?.title || '');
  const [content, setContent] = useState<string>(initialData?.content || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [error, setError] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const generateBlogPostMutation = useGenerateBlogPost({
    onSuccess: (generatedContent) => {
      setContent(generatedContent);
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleTagSelection = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags((prevTags) => [...prevTags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prevTags) => prevTags.filter((t) => t !== tag));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      setError('Title and Content are required.');
      return;
    }

    if (!user?.id) {
      setError("User is not logged in.");
      return;
    }

    const postData = { 
      id: initialData?.id,
      title, 
      content, 
      userId: 
      user.id, 
      tags, 
      files 
    };

    if (!isEditMode && user?.id) {
      onSubmit({ ...postData, userId: user.id });
    } else {
      onSubmit(postData);
    }
    onClose();
  };

  return (
    <>
      <form onSubmit={handleFormSubmit} className="space-y-6 p-4">
        <h2 className="text-xl font-semibold text-gray-900">Create a New Post</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your post content..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={6}
          />
          <button
              type="button"
              onClick={() => setIsAiModalOpen(true)}
              className="absolute top-8 right-2 flex items-center justify-center p-2 bg-white/80 backdrop-blur-md border border-indigo-100 rounded-md shadow-md hover:bg-indigo-100"
              title="Generate with AI"
            >
              ✨
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm bg-white text-left hover:bg-gray-50 transition">
                {tags.length === 0 ? "Select tags" : "Add more tags"}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full bg-white border border-gray-200 rounded-md shadow-md z-50">
              {blogTags.map((tag) => (
                <DropdownMenuItem
                  key={tag.value}
                  onSelect={() => handleTagSelection(tag.value)}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                    tags.includes(tag.value) ? 'bg-blue-100 text-blue-700' : ''
                  }`}
                >
                  {tag.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-200 text-sm font-medium"
                >
                  {blogTags.find((t) => t.value === tag)?.label || tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-gray-600 hover:text-red-500"
                    type="button"
                  >
                    ✖
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* File Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="w-full p-6 border-dashed border-2 border-gray-300 rounded-md text-center bg-white"
        >
          <div className="text-2xl mb-2">📎</div>
          <p className="text-gray-600 text-sm mb-1">Drag and drop images, or</p>
          <label htmlFor="file-upload" className="cursor-pointer text-indigo-600 text-sm font-medium underline">
            Select Files
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
        </div>

        {/* Display selected files */}
        {files.length > 0 && (
          <ul className="mt-3 space-y-2 text-sm">
            {files.map((file, index) => (
              <li key={index} className="flex justify-between items-center border-b pb-1">
                <span>{file.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="text-red-500 hover:underline text-xs"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-end gap-4 pt-2">
          <Button
            type="button"
            onClick={onClose}
            className="border border-gray-300 text-sm px-4 py-2 rounded-md text-gray-700 bg-white hover:bg-red-500 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleFormSubmit}
            animation={"default"}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm px-4 py-2 rounded-md shadow hover:opacity-90 transition"
          >
            Submit
          </Button>
        </div>
      </form>

      {/* AI Modal for Blog Content */}
      <AiPromptModal
        isOpen={isAiModalOpen}
        setIsOpen={setIsAiModalOpen}
        onApply={(generatedText) => setContent(generatedText)}
        generateMutation={{
          mutate: generateBlogPostMutation.mutate,
          isLoading: generateBlogPostMutation.isLoading,
        }}
        title="Generate Blog Post Content"
        confirmText="Use this Content"
      />
    </>
    
  );
};


export default CreatePostForm;
