import React from 'react';
import BlogContainer from '@/components/ui/blog/BlogContainer';

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
  {
    type: 'Article',
    title: 'The Future of Finance in Freelancing',
    body: 'Freelancers are now leveraging advanced financial tools to manage their income, expenses, and taxes. In this article, we explore the top tools that every freelancer should know about to stay ahead in the financial game.',
    userName: 'Finance Expert',
    fieldOfWork: 'Finance',
    profilePicture: '',
    date: 'December 10, 2024',
    tags: ['Finance', 'Freelancing', 'Tips']
  },
  {
    type: 'News',
    title: 'Backend Technologies to Watch in 2025',
    body: 'The world of backend development is rapidly evolving with new frameworks and languages. This article highlights the top backend technologies that are expected to dominate in 2025, including Rust and serverless computing.',
    userName: 'DevTech News',
    fieldOfWork: 'Backend Development',
    profilePicture: '',
    date: 'December 5, 2024',
    tags: ['Backend', 'Development', 'Technology']
  },
  {
    type: 'Event',
    title: 'Cybersecurity Workshop for Freelancers',
    body: 'Join us for a hands-on workshop where we discuss cybersecurity best practices for freelancers. Learn how to protect your client data and secure your online accounts with practical tips and tools.',
    userName: 'Secure Freelance',
    fieldOfWork: 'Security',
    profilePicture: '',
    date: 'January 15, 2025',
    tags: ['Security', 'Freelancing', 'Workshops']
  },
  {
    type: 'Article',
    title: 'How to Manage Freelance Finances Like a Pro',
    body: 'Managing finances as a freelancer can be challenging. From tracking expenses to saving for taxes, this article provides actionable tips to help you become a finance-savvy freelancer.',
    userName: 'Finance Guru',
    fieldOfWork: 'Finance',
    profilePicture: '',
    date: 'November 30, 2024',
    tags: ['Finance', 'Freelancing', 'Tips']
  },
  {
    type: 'News',
    title: 'The Role of AI in Backend Automation',
    body: 'Artificial Intelligence is transforming the way backend systems are managed. This article delves into how AI is used for database optimization, server management, and API handling.',
    userName: 'AI Innovators',
    fieldOfWork: 'Backend Development',
    profilePicture: '',
    date: 'December 20, 2024',
    tags: ['Backend', 'AI', 'Automation']
  },
  {
    type: 'Event',
    title: 'Finance Tools Expo for Freelancers',
    body: 'Discover the latest finance tools designed specifically for freelancers at our annual Finance Tools Expo. Get insights from industry leaders and explore tools that make financial management a breeze.',
    userName: 'Freelance Finance',
    fieldOfWork: 'Finance',
    profilePicture: '',
    date: 'February 1, 2025',
    tags: ['Finance', 'Events', 'Freelancing']
  },
  {
    type: 'Article',
    title: 'The Best Backend Frameworks for Startups',
    body: 'Startups often struggle to choose the right backend framework. This article discusses the most efficient and scalable backend frameworks that startups should consider.',
    userName: 'Tech Startup Guide',
    fieldOfWork: 'Backend Development',
    profilePicture: '',
    date: 'December 8, 2024',
    tags: ['Backend', 'Development', 'Startups']
  },
  {
    type: 'News',
    title: 'The Importance of Cybersecurity for Small Businesses',
    body: 'Small businesses are increasingly targeted by cyberattacks. This article explores the best practices and tools to secure your business from digital threats.',
    userName: 'CyberSafe Team',
    fieldOfWork: 'Security',
    profilePicture: '',
    date: 'January 5, 2025',
    tags: ['Security', 'Small Business', 'Tips']
  },
  {
    type: 'Event',
    title: 'Freelancing in Content Writing: Skills for 2025',
    body: 'This event will cover the evolving skills required for successful content writing in the freelance market. Learn from top writers and improve your skills for the upcoming year.',
    userName: 'Content Writers United',
    fieldOfWork: 'Content Writing',
    profilePicture: '',
    date: 'February 20, 2025',
    tags: ['Freelancing', 'Content Writing', 'Workshops']
  },
  {
    type: 'Article',
    title: '5 Steps to Improve Your Security Practices',
    body: 'Whether you are a freelancer or a small business owner, security should be a top priority. This article provides five easy steps to improve your online and offline security practices.',
    userName: 'Secure Future',
    fieldOfWork: 'Security',
    profilePicture: '',
    date: 'January 2, 2025',
    tags: ['Security', 'Tips', 'Freelancing']
  }
];


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
          <BlogContainer blogPosts={blogPosts} />
        </div>
      </div>
    </>
  );
}

export default BlogPage;