// pages/success-stories.tsx
"use client";
import React, { useState } from 'react';
import CommentCard from '@/components/ui/CommentCard';
import image1 from '@/public/images/freelancer-hero-img-1.jpg';
import image2 from '@/public/images/freelancer-hero-img-2.jpg';

// Mock data for success stories
const successStories = [
  { img: image1, name: 'Alice Johnson', location: 'San Francisco, USA', comment: 'This platform helped me land my dream projects. Highly recommend!' },
  { img: image2, name: 'David Brown', location: 'London, UK', comment: 'Thanks to Quolance, I connected with amazing clients and grew my freelance business!' },
  { img: image2, name: 'Lina Chen', location: 'Toronto, Canada', comment: 'Quolance has changed the way I work, providing great clients and meaningful projects.' },
  { img: image1, name: 'Tom Lee', location: 'Sydney, Australia', comment: 'An incredible experience with wonderful support from the Quolance team.' },
  { img: image1, name: 'Sofia Martinez', location: 'Madrid, Spain', comment: 'The best freelancing platform I’ve come across! Fantastic opportunities.' },
  { img: image2, name: 'Michael Kim', location: 'Seoul, South Korea', comment: 'Amazing platform! Quolance allowed me to find quality clients easily.' },
  { img: image1, name: 'Emma Zhang', location: 'Shanghai, China', comment: 'Quolance connected me with projects that helped me grow professionally.' },
  { img: image2, name: 'Liam Smith', location: 'Berlin, Germany', comment: 'Great place to find reliable clients. My freelancing has improved significantly!' },
  { img: image2, name: 'Olivia White', location: 'Dublin, Ireland', comment: 'Quolance opened doors to great collaborations. Highly appreciated!' },
  { img: image1, name: 'Noah Williams', location: 'New York, USA', comment: 'I love Quolance! The platform is efficient and connects me with the best clients.' },
  { img: image1, name: 'Mia Patel', location: 'Mumbai, India', comment: 'My freelancing journey transformed after I joined Quolance. Amazing platform!' },
];
const itemsPerPage = 6;

const SuccessStoriesPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(successStories.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedStories = successStories.slice(startIdx, startIdx + itemsPerPage);

  // Handler for changing pages
  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="flex justify-center p-8">
      <div className="w-[80%]">
        <h2 className="heading-2 mb-2">Success Stories</h2>
        <p className="mb-4 text-gray-600">Discover success stories from our users.</p>

        {/* Display paginated success stories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {paginatedStories.map((story, index) => (
            <CommentCard
              key={index}
              img={story.img}
              name={story.name}
              location={story.location}
              comment={story.comment}
            />
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuccessStoriesPage;