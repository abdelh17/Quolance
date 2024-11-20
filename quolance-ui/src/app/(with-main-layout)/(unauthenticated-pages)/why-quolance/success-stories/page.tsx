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
    <div className=" px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto bg-gray-800 dark:bg-neutral-950">
      {/* Title */}
      <div className="max-w-2xl mb-10">
        <h2 className="text-2xl font-bold md:text-4xl md:leading-tight text-gray-100">Customer stories</h2>
        <p className="mt-1 text-gray-400 dark:text-neutral-400">
          See how game-changing companies are making the most of every engagement with Quolance.
        </p>
      </div>
      {/* End Title */}

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <a className="group block rounded-xl focus:outline-none" href="#">
          <div className="aspect-w-16 aspect-h-9">
            <img
              className="w-full object-cover rounded-xl"
              src="https://images.unsplash.com/photo-1668869713519-9bcbb0da7171?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&q=80"
              alt="Unity’s inside sales team drives 80% of its revenue with Preline."
            />
          </div>
          <h3 className="mt-2 text-lg font-medium text-white group-hover:text-blue-600 group-focus:text-blue-600 dark:text-neutral-300 dark:group-hover:text-white dark:group-focus:text-white">
            Freelancer sign up interest doubles in size this month.
          </h3>
          <p className="mt-2 text-sm text-gray-400 dark:text-neutral-400"> November 18, 2024</p>
        </a>
        {/* End Card 1 */}

        {/* Card 2 */}
        <a className="group block rounded-xl focus:outline-none" href="#">
          <div className="aspect-w-16 aspect-h-9">
            <img
              className="w-full object-cover rounded-xl"
              src="https://images.unsplash.com/photo-1668584054035-f5ba7d426401?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&q=80"
              alt="Living Spaces creates a unified experience across the customer journey."
            />
          </div>
          <h3 className="mt-2 text-lg font-medium text-white group-hover:text-blue-600 group-focus:text-blue-600 dark:text-neutral-300 dark:group-hover:text-white dark:group-focus:text-white">
            Learn about clients that succesfully used Quolance to meet their goal. 
          </h3>
          <p className="mt-2 text-sm text-gray-400 dark:text-neutral-400">September 12, 2024</p>
        </a>
        {/* End Card 2 */}

        {/* Card 3 */}
        <a className="group block rounded-xl focus:outline-none" href="#">
          <div className="aspect-w-16 aspect-h-9">
            <img
              className="w-full object-cover rounded-xl"
              src="https://images.unsplash.com/photo-1668863699009-1e3b4118675d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&q=80"
              alt="Atlassian powers sales and support at scale with Preline."
            />
          </div>
          <h3 className="mt-2 text-lg font-medium text-white group-hover:text-blue-600 group-focus:text-blue-600 dark:text-neutral-300 dark:group-hover:text-white dark:group-focus:text-white">
            Apps created by Quolance freelancers emerge across the globe!
          </h3>
          <p className="mt-2 text-sm text-gray-400 dark:text-neutral-400">December 11, 2023</p>
        </a>
        {/* End Card 3 */}

        {/* Card 4 */}
        <a className="group block rounded-xl focus:outline-none" href="#">
          <div className="aspect-w-16 aspect-h-9">
            <img
              className="w-full object-cover rounded-xl"
              src="https://images.unsplash.com/photo-1668584054131-d5721c515211?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&q=80"
              alt="Everything you need to know about Preline Pro."
            />
          </div>
          <h3 className="mt-2 text-lg font-medium text-white group-hover:text-blue-600 group-focus:text-blue-600 dark:text-neutral-300 dark:group-hover:text-white dark:group-focus:text-white">
            Big news coming from Quolance
          </h3>
          <p className="mt-2 text-sm text-gray-400 dark:text-neutral-400">November 30, 2024</p>
        </a>
        {/* End Card 4 */}
      </div>
      {/* End Grid */}
    </div>
  );
};

export default SuccessStoriesPage;