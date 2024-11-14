// pages/reviews.tsx
"use client";
import React, { useState } from 'react';
import CommentCard from '@/components/ui/CommentCard';
import image1 from '@/public/images/freelancer-hero-img-1.jpg';
import image2 from '@/public/images/freelancer-hero-img-2.jpg';


// Mock data for reviews
const reviewsData = [
  { img: image1, name: 'Emily Carter', location: 'Austin, USA', comment: 'Fantastic platform! I found great clients and meaningful projects.' },
  { img: image2, name: 'James Wilson', location: 'Sydney, Australia', comment: 'Quolance has connected me with top-notch freelancers and clients.' },
  { img: image1, name: 'Sophia Moore', location: 'Berlin, Germany', comment: 'This platform has been a game-changer for my freelance career!' },
  { img: image2, name: 'Daniel Garcia', location: 'Mexico City, Mexico', comment: 'Quolance provided me with amazing freelance opportunities. Love it!' },
  { img: image1, name: 'Zara Ahmed', location: 'Dubai, UAE', comment: 'Thanks to Quolance, I’ve connected with clients globally. Great platform!' },
  { img: image1, name: 'Henry Dupont', location: 'Paris, France', comment: 'Very pleased with the service. Quolance is the go-to for quality freelancing.' },
  { img: image2, name: 'Olivia Rossi', location: 'Rome, Italy', comment: 'My freelance journey wouldn’t be the same without Quolance. Incredible support!' },
  { img: image2, name: 'Ethan Novak', location: 'Warsaw, Poland', comment: 'Professional platform that connects you with the best clients out there.' },
  { img: image2, name: 'Amelia Davies', location: 'Cape Town, South Africa', comment: 'Quolance gave me the boost I needed in freelancing. So grateful!' },
];

const itemsPerPage = 6;

const ReviewsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(reviewsData.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedReviews = reviewsData.slice(startIdx, startIdx + itemsPerPage);

  // Handler for changing pages
  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="flex justify-center p-8">
      <div className="w-[80%]">
        <h2 className="heading-2 mb-2">User Reviews</h2>
        <p className="mb-4 text-gray-600">See what our users have to say about their experience on Quolance.</p>

        {/* Display paginated reviews */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {paginatedReviews.map((review, index) => (
            <CommentCard
              key={index}
              img={review.img}
              name={review.name}
              location={review.location}
              comment={review.comment}
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

export default ReviewsPage;