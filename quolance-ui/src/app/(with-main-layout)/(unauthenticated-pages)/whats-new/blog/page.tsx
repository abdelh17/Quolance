import React from 'react';
import BlogContainer from '@/components/ui/blog/BlogContainer';


function BlogPage() {
  return (
    <>
      <div className="bg-white">
        <div className="max-w-[1400px] mx-auto relative p-10 lg:p-16">
          <div className="max-w-2xl mb-10">
              <h2 className="text-2xl font-bold md:text-4xl md:leading-tight text-gray-900">Blog</h2>
              <p className="mt-1 text-gray-800">
                Stay up to date with the latest news. Here you can find articles, events, news.
              </p>
          </div>

          <BlogContainer/>

        </div>
      </div>
    </>
  );
}

export default BlogPage;