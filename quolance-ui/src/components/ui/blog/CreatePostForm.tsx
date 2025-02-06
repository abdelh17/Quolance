'use client';

import React, { useState } from 'react';
import { useAuthGuard } from '@/api/auth-api';

interface CreatePostFormProps {
  // onSubmit: (postData: { title: string; content: string; tags: string[] }) => void;
  onSubmit: (postData: { title: string; content: string; userId: number | undefined; imageUrls? : string[] }) => void;
  onClose: () => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onSubmit, onClose }) => {
  const { user } = useAuthGuard({ middleware: 'auth' }); // Get the authenticated user
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  //const [tags, setTags] = useState<string>('');
  const [error, setError] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>(['']);

  //console.log(user?.id);

  const handleAddImageField = () => {
    if (imageUrls.length < 8) {
      setImageUrls([...imageUrls, '']);
    }
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const updatedUrls = [...imageUrls];
    updatedUrls[index] = value;
    setImageUrls(updatedUrls);
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

    // Convert comma-separated tags into an array
    //const tagsArray = tags.split(',').map((tag) => tag.trim()).filter((tag) => tag);

    // onSubmit({ title, content, tags: tagsArray });
    onSubmit({ title, content, userId: user?.id, imageUrls: imageUrls.filter((url) => url.trim() !== '') });
    setTitle('');
    setContent('');
    setImageUrls(['']);
    //setTags('');
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

      {/* Dynamic image URL input fields */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Image URLs</label>
        {imageUrls.map((url, index) => (
          <input
            key={index}
            type="text"
            value={url}
            onChange={(e) => handleImageUrlChange(index, e.target.value)}
            placeholder={`Image URL ${index + 1}`}
            className="w-full p-2 border rounded-md mb-2"
          />
        ))}

        {imageUrls.length < 8 && (
          <button
            type="button"
            onClick={handleAddImageField}
            className="px-3 py-1 bg-blue-500 text-white rounded-md"
          >
            Add Another Image
          </button>
        )}
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
