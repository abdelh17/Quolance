import React from 'react';
import BlogContainer from '@/components/ui/blog/BlogContainer';
function BlogPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">Quolance Blog</h1>
          <p className="text-gray-600 mt-2 text-lg">
            Stay updated with news, tips, and community stories.
          </p>
        </div>

        <BlogContainer />
      </div>
    </div>
  );
}

export default BlogPage;
