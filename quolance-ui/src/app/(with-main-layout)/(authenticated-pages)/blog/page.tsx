'use client'

import React from 'react';
import BlogContainer from '@/components/ui/blog/BlogContainer';

function BlogPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Bubbles */}
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-200 opacity-60 blur-3xl animate-blob"></div>
        <div className="absolute top-60 -left-20 h-60 w-60 rounded-full bg-indigo-200 opacity-60 blur-3xl animate-blob animation-delay-2000"></div>

        {/* Sophisticated Circuit Pattern */}
        <svg width="100%" height="100%" className="absolute inset-0 text-gray-200/10 opacity-20" style={{ mixBlendMode: 'overlay' }}>
          <defs>
            <pattern id="sophisticated-circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path 
                d="M0 50 Q25 25, 50 50 T100 50 
                   M50 0 Q75 25, 50 50 T50 100 
                   M25 25 Q50 50, 75 25 T125 25" 
                stroke="currentColor" 
                strokeWidth="0.5" 
                fill="none" 
                strokeDasharray="5 5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sophisticated-circuit)" />
        </svg>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-blue-200/30 rounded-full mix-blend-multiply animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-indigo-200/30 rounded-full mix-blend-multiply animate-float animation-delay-4000"></div>
      </div>

      {/* Blog Content */}
      <div className="relative z-10">
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

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, 50px) scale(1.2); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-blob {
          animation: blob 15s infinite;
        }
        .animate-float {
          animation: float 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default BlogPage;
