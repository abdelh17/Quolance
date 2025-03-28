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
    <form onSubmit={handleFormSubmit} className="space-y-4 m-2">
      <h2 className="text-lg font-bold mb-4">Create a New Post</h2>

      {error && <p className="text-red-500">{error}</p>}

      <div>
        <label className="block text-gray-700 font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter post content"
          className="w-full p-2 border rounded-md"
          rows={5}
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">Tags</label>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full p-2 border rounded-md bg-white text-left">
              Select a tag
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full bg-white">
            {blogTags.map((tag) => (
              <DropdownMenuItem
                key={tag.value}
                onSelect={() => handleTagSelection(tag.value)}
                className={`p-2 cursor-pointer hover:bg-gray-200 ${
                  tags.includes(tag.value) ? 'bg-gray-300' : ''
                }`}
              >
                {tag.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="bg-gray-200 px-2 py-1 rounded-md flex items-center text-sm">
                {blogTags.find((t) => t.value === tag)?.label || tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-red-500"
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
        className="w-full p-4 border-dashed border-2 border-gray-300 rounded-md text-center"
      >
        <p className="text-gray-500">Drag and drop images here or click to select files</p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer text-blue-500 underline"
        >
          Select Files
        </label>
      </div>

      {/* Display selected files */}
      {files.length > 0 && (
        <ul className="mt-3">
          {files.map((file, index) => (
            <li key={index} className="flex justify-between items-center p-2 border-b">
              <span>{file.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="text-red-500 bg-red text-sm"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-end space-x-4 mb-4">
        <Button
          onClick={onClose}
          bgColor='red-600'
          animation="default"
        >
          Cancel
        </Button>
        <Button
          onClick={handleFormSubmit}
          animation="default"
        >
          Submit
        </Button>
      </div>
    </form>
  );
};


export default CreatePostForm;
