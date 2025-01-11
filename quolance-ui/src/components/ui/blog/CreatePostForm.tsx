'use client';

import React, { useState } from 'react';

interface CreatePostFormProps {
  onSubmit: (postData: { title: string; content: string; tags: string[] }) => void;
  onClose: () => void;
  user: any;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onSubmit, onClose, user }) => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [error, setError] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      setError('Title and Content are required.');
      return;
    }

    // Convert comma-separated tags into an array
    const tagsArray = tags.split(',').map((tag) => tag.trim()).filter((tag) => tag);

    onSubmit({ user, title, content, tags: tagsArray });
    setTitle('');
    setContent('');
    setTags('');
    setError('');
    onClose();
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
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
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Enter tags (comma separated)"
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div className="flex items-center justify-end space-x-4 mb-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
        >
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
          Submit
        </button>
      </div>
    </form>
  );
};

export default CreatePostForm;
