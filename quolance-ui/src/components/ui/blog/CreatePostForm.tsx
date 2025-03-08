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
  'Question',
  'Support',
  'Freelancing',
  'Skill Matching',
  'Remote Work',
  'AI Suggestions',
  'Security',
  'Talent Marketplace',
  'Global Opportunities',
  'Verified Profiles',
  'Collaboration Tools',
  'Professional Network',
  'Billing',
];

interface CreatePostFormProps {
  onSubmit: (postData: { title: string; content: string; userId: string | undefined; files?: File[]  }) => void;
  onClose: () => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onSubmit, onClose }) => {
  const { user } = useAuthGuard({ middleware: 'auth' });
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
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


    onSubmit({ title, content, userId: user?.id, files });
    setTitle('');
    setContent('');
    setFiles([]);
    setTags([]);
    setError('');
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
                key={tag}
                onSelect={() => handleTagSelection(tag)}
                className={`p-2 cursor-pointer hover:bg-gray-200 ${
                  tags.includes(tag) ? 'bg-gray-300' : ''
                }`}
              >
                {tag}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="bg-gray-200 px-2 py-1 rounded-md flex items-center text-sm">
                {tag}
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
