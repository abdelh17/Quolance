import React from 'react';
import BlogContainer from '@/components/ui/blog/BlogContainer';
import SearchBar from '@/components/ui/blog/SearchBar';
import icon from '@/public/images/freelancer_default_icon.png';

{/* Mock data for blog posts */}
const blogPosts = [
  { 
    type: 'Event',
    title: '30th anniversary UI/UX Design Challenge',
    body: 'For our 30th anniversary, we are looking for a creative temporary design where navigating feels like a game. The design that will be chosen will be rewarded with a 2 years subscription to our platform along with a 25 000$ cash prize. The challenge will start on the 1st of January 2025 and will end on the 1st of February 2025. For our 30th anniversary, we are looking for a creative temporary design where navigating feels like a game. The design that will be chosen will be rewarded with a 2 years subscription to our platform along with a 25 000$ cash prize. The challenge will start on the 1st of January 2025 and will end on the 1st of February 2025. For our 30th anniversary, we are looking for a creative temporary design where navigating feels like a game. The design that will be chosen will be rewarded with a 2 years subscription to our platform along with a 25 000$ cash prize. The challenge will start on the 1st of January 2025 and will end on the 1st of February 2025. ',
    userName: 'SomeCompany',
    fieldOfWork: 'Entertainment',
    profilePicture: '',
    date: 'December 1, 2024',
    tags: ['UX/UI Design', 'Graphic Design', 'Events']
  },
  {
    type: 'News', 
    title: 'New feature: Quolance Pro', 
    body: 'Quolance Pro is a new feature that will allow you to get access to premium features such as a dedicated account manager, priority support, and more. The price for Quolance Pro will be 25$ per month. Quolance Pro is a new feature that will allow you to get access to premium features such as a dedicated account manager, priority support, and more. The price for Quolance Pro will be 25$ per month. Quolance Pro is a new feature that will allow you to get access to premium features such as a dedicated account manager, priority support, and more. The price for Quolance Pro will be 25$ per month. Quolance Pro is a new feature that will allow you to get access to premium features such as a dedicated account manager, priority support, and more. The price for Quolance Pro will be 25$ per month. Quolance Pro is a new feature that will allow you to get access to premium features such as a dedicated account manager, priority support, and more. The price for Quolance Pro will be 25$ per month. ', 
    userName: 'Quolance Team',
    fieldOfWork: 'Development',
    profilePicture: '',
    date: 'November 25, 2024',
    tags: ['Product Updates', 'Premium Features', 'Subscription']
  },
  {
    type: 'Event', 
    title: 'Quolance Hackathon', 
    body: 'Quolance is organizing a hackathon that will take place on the 15th of December 2024. The theme of the hackathon is "Building the future of work". The winning team will be rewarded with a 10 000$ cash prize. Quolance is organizing a hackathon that will take place on the 15th of December 2024. The theme of the hackathon is "Building the future of work". The winning team will be rewarded with a 10 000$ cash prize. Quolance is organizing a hackathon that will take place on the 15th of December 2024. The theme of the hackathon is "Building the future of work". The winning team will be rewarded with a 10 000$ cash prize. Quolance is organizing a hackathon that will take place on the 15th of December 2024. The theme of the hackathon is "Building the future of work". The winning team will be rewarded with a 10 000$ cash prize. Quolance is organizing a hackathon that will take place on the 15th of December 2024. The theme of the hackathon is "Building the future of work". The winning team will be rewarded with a 10 000$ cash prize.', 
    userName: 'Quolance Team',
    fieldOfWork: 'Development',
    profilePicture: '',
    date: 'November 20, 2024',
    tags: ['Hackathon', 'Innovation', 'Events']
  },
  {
    type: 'Article', 
    title: '5 mistakes to avoid when hiring a freelancer', 
    body: 'Hiring a freelancer can be a great way to get work done quickly and efficiently. However, there are some common mistakes that people make when hiring freelancers that can lead to problems down the line. In this article, we will discuss 5 mistakes to avoid when hiring a freelancer. Hiring a freelancer can be a great way to get work done quickly and efficiently. However, there are some common mistakes that people make when hiring freelancers that can lead to problems down the line. In this article, we will discuss 5 mistakes to avoid when hiring a freelancer. Hiring a freelancer can be a great way to get work done quickly and efficiently. However, there are some common mistakes that people make when hiring freelancers that can lead to problems down the line. In this article, we will discuss 5 mistakes to avoid when hiring a freelancer. Hiring a freelancer can be a great way to get work done quickly and efficiently. However, there are some common mistakes that people make when hiring freelancers that can lead to problems down the line. In this article, we will discuss 5 mistakes to avoid when hiring a freelancer.', 
    userName: 'SomeUser',
    fieldOfWork: 'Human Resources',
    profilePicture: '',
    date: 'November 15, 2024',
    tags: ['Freelancing', 'Hiring', 'Tips']
  },
];


function BlogPage() {
  return (
    <>
      <div className="bg-gray-800 dark:bg-gray-950">
        <div className="max-w-[1400px] mx-auto relative p-10 lg:p-16">
          <div className="max-w-2xl mb-10">
              <h2 className="text-2xl font-bold md:text-4xl md:leading-tight text-gray-100">Blog</h2>
              <p className="mt-1 text-gray-400 dark:text-neutral-400">
                Stay up to date with the latest news. Here you can find articles, events, news.
              </p>
          </div>
          <SearchBar />
          <BlogContainer blogPosts={blogPosts} />
        </div>
      </div>
    </>
  );
}

export default BlogPage;