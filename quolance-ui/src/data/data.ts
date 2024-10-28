import { v4 as uuidv4 } from 'uuid';

import { UserType } from '@/types/userTypes';
import { ProjectType } from '@/types/projectTypes';

export const headerMenu = [
  {
    id: uuidv4(),
    name: 'Projects',
    isSubmenu: true,
    submenu: [
      {
        id: uuidv4(),
        name: 'All Projects',
        link: '/projects',
      },
    ],
  },
];

export const ProjectList: ProjectType[] = [
  {
    id: 1,
    name: 'Real-Time Video Streaming Platform Development',
    description:
      'Develop a scalable video streaming platform with real-time video and chat features. Must support multiple users and handle high traffic efficiently. Use modern technologies like WebRTC. Backend should be built using Node.js and socket.io.',
    tags: ['web', 'node', 'webrtc'],
    datePosted: '2024-10-25',
    status: 'open',
    applicants: 8,
  },
  {
    id: 2,
    name: 'Develop a Full-Stack Marketplace Application',
    description:
      'Create a marketplace web app allowing users to buy and sell products. Include secure payment processing and a rating system for buyers and sellers. Preferred technologies are React for the frontend and Node.js for the backend.',
    tags: ['web', 'react', 'node'],
    datePosted: '2024-10-24',
    status: 'open',
    applicants: 5,
  },
  {
    id: 3,
    name: 'Build a Healthcare Mobile App with Appointment Booking',
    description:
      'Develop a healthcare app that allows patients to book appointments with doctors. Integrate a calendar system and notifications. The app should be cross-platform and secure, using React Native.',
    tags: ['mobile', 'react-native', 'health'],
    datePosted: '2024-10-23',
    status: 'open',
    applicants: 12,
  },
  {
    id: 4,
    name: 'Design and Build a Corporate Website with WordPress',
    description:
      'Design a responsive corporate website for a tech company. Must include a blog, product pages, and contact forms. The website should be SEO-optimized and built with WordPress.',
    tags: ['web', 'wordpress', 'seo'],
    datePosted: '2024-10-22',
    status: 'open',
    applicants: 6,
  },
  {
    id: 5,
    name: 'Develop a Progressive Web App (PWA) for News Aggregation',
    description:
      'Create a PWA that aggregates news from various sources in real-time. Must include push notifications and offline access. Technologies: React and Node.js.',
    tags: ['web', 'pwa', 'node'],
    datePosted: '2024-10-21',
    status: 'open',
    applicants: 9,
  },
  {
    id: 6,
    name: 'Build an Online Learning Platform with Video Lectures',
    description:
      'Develop an online learning platform that allows users to watch video lectures and take quizzes. Include user profiles and progress tracking. Use Laravel for the backend and Vue.js for the frontend.',
    tags: ['web', 'laravel', 'vue'],
    datePosted: '2024-10-20',
    status: 'open',
    applicants: 4,
  },
  {
    id: 7,
    name: 'Develop a CRM System with Task Management Features',
    description:
      'Create a CRM system that allows businesses to manage customer interactions and tasks. Integrate email tracking and a task scheduler. Backend in Python with a Django framework.',
    tags: ['web', 'python', 'django'],
    datePosted: '2024-10-19',
    status: 'open',
    applicants: 3,
  },
  {
    id: 8,
    name: 'Build a FinTech App for Personal Budget Management',
    description:
      'Develop a personal budgeting app that helps users track their spending and savings goals. Include graphs for data visualization. Prefer using React Native and a Node.js backend.',
    tags: ['mobile', 'react-native', 'fintech'],
    datePosted: '2024-10-18',
    status: 'open',
    applicants: 11,
  },
  {
    id: 9,
    name: 'Create a Real Estate Listing Website with Filters',
    description:
      'Develop a real estate listing platform with advanced search and filtering options. Include a map integration for location-based searches. Use Vue.js and a PHP backend.',
    tags: ['web', 'vue', 'php'],
    datePosted: '2024-10-17',
    status: 'open',
    applicants: 7,
  },
  {
    id: 10,
    name: 'Blockchain-Powered NFT Marketplace Development',
    description:
      'Develop an NFT marketplace that allows users to mint, buy, and sell NFTs. Include a wallet integration and smart contract functionality. Use Solidity for smart contracts and React for the frontend.',
    tags: ['web', 'blockchain', 'solidity'],
    datePosted: '2024-10-16',
    status: 'open',
    applicants: 6,
  },
  {
    id: 11,
    name: 'AI-Based Job Recommendation System',
    description:
      'Develop an AI-based job recommendation platform that matches users to jobs based on their profiles. The platform should use machine learning algorithms and provide real-time job recommendations.',
    tags: ['ai', 'python', 'machine-learning'],
    datePosted: '2024-10-15',
    status: 'closed',
    applicants: 14,
  },
  {
    id: 12,
    name: 'Implement a Cloud-Based Inventory Management System',
    description:
      'Develop a cloud-based inventory management system for small businesses. Include features like product tracking, stock alerts, and sales reporting. Use AWS and Python.',
    tags: ['cloud', 'aws', 'python'],
    datePosted: '2024-10-14',
    status: 'closed',
    applicants: 9,
  },
  {
    id: 13,
    name: 'Create a Mobile App for Event Management',
    description:
      'Develop a mobile app that allows users to manage events, sell tickets, and provide updates. The app should support notifications and social media integrations. Use React Native and Firebase.',
    tags: ['mobile', 'react-native', 'firebase'],
    datePosted: '2024-10-13',
    status: 'closed',
    applicants: 13,
  },
  {
    id: 14,
    name: 'Web Scraping Tool for Market Data Collection',
    description:
      'Build a web scraping tool that collects market data from various sources. The tool should store data in a structured format and provide analytics. Use Python with Scrapy.',
    tags: ['web', 'python', 'analytics'],
    datePosted: '2024-10-12',
    status: 'closed',
    applicants: 5,
  },
  {
    id: 15,
    name: 'Develop a Social Media Monitoring Tool',
    description:
      'Create a tool that monitors and analyzes social media trends in real-time. Provide sentiment analysis and keyword tracking. Use Python for data processing and React for the frontend.',
    tags: ['web', 'python', 'react'],
    datePosted: '2024-10-11',
    status: 'closed',
    applicants: 8,
  },
  {
    id: 16,
    name: 'Redesign E-Commerce Website for Improved UX/UI',
    description:
      'Redesign an existing e-commerce website to improve the user experience and interface. Focus on mobile responsiveness and accessibility. Use HTML, CSS, and JavaScript.',
    tags: ['web', 'ux/ui', 'html'],
    datePosted: '2024-10-10',
    status: 'closed',
    applicants: 10,
  },
];

export const Users: UserType[] = [
  {
    id: '1',
    name: 'John Admin',
    email: 'john.admin@quolance.com',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'David Client',
    email: 'david.client@gmail.com',
    role: 'client',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '3',
    name: 'Mike Freelancer',
    email: 'mike.freelancer@gmail.com',
    role: 'freelancer',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    email: 'sarah.j@gmail.com',
    role: 'freelancer',
    createdAt: '2024-02-05T00:00:00Z',
    updatedAt: '2024-02-05T00:00:00Z',
  },
  {
    id: '5',
    name: 'Alex Chen',
    email: 'alex.chen@gmail.com',
    role: 'freelancer',
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
  },
  {
    id: '6',
    name: 'Emma Wilson',
    email: 'emma.w@gmail.com',
    role: 'freelancer',
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
  },
];

export const submissioners = [
  {
    id: uuidv4(),
    img: 'expertImg1',
    freelancerName: 'Juan Mullins',
    location: 'Brooklyn, NY, USA',
    features: ['$50 - &100/hr', 'TOP INDEPENDENT', 'AVAILABLE'],
    services: ['Handyman', 'Gardening'],
  },
  {
    id: uuidv4(),
    img: 'expertImg2',
    freelancerName: 'Ronald Higgins',
    location: 'Brooklyn, NY, USA',
    features: ['$45 - &80/hr', 'TOP INDEPENDENT', 'AVAILABLE'],
    services: ['Plumber', 'Handyman'],
  },
  {
    id: uuidv4(),
    img: 'expertImg3',
    freelancerName: 'Leroy Curtis',
    location: 'Brooklyn, NY, USA',
    features: ['$75 - &150/hr', 'TOP INDEPENDENT', 'AVAILABLE'],
  },
  {
    id: uuidv4(),
    img: 'expertImg4',
    freelancerName: 'Kenneth Sims',
    location: 'Brooklyn, NY, USA',
    features: ['$25 - &150/hr', 'TOP INDEPENDENT', 'AVAILABLE'],
    services: ['Plumber', 'Cleaning', 'Plumber', 'Plumber'],
  },
  {
    id: uuidv4(),
    img: 'expertImg5',
    freelancerName: 'Sarah Bryan',
    location: 'Brooklyn, NY, USA',
    features: ['$75 - &200/hr', 'TOP INDEPENDENT', 'AVAILABLE'],
    services: ['Plumber', 'Gardening', 'Plumber'],
  },
  {
    id: uuidv4(),
    img: 'expertImg6',
    freelancerName: 'Todd Meyer',
    location: 'Brooklyn, NY, USA',
    features: ['$75 - &150/hr', 'TOP INDEPENDENT', 'AVAILABLE'],
    services: ['Gardening', 'Photography', 'Plumber', 'Plumber', 'Handyman'],
  },
  {
    id: uuidv4(),
    img: 'expertImg1',
    freelancerName: 'Jeanette Alexander',
    location: 'Brooklyn, NY, USA',
    features: ['$50 - &100/hr', 'TOP INDEPENDENT', 'AVAILABLE'],
    services: ['Handyman', 'Photography', 'Plumber', 'Plumber'],
  },
  {
    id: uuidv4(),
    img: 'expertImg5',
    freelancerName: 'Beatrice Gill',
    location: 'Brooklyn, NY, USA',
    features: ['$75 - &100/hr', 'TOP INDEPENDENT', 'AVAILABLE'],
    services: [
      'Photography',
      'Gardening',
      'Plumber',
      'Plumber',
      'Plumber',
      'Plumber',
      'Plumber',
      'Plumber',
    ],
  },
  {
    id: uuidv4(),
    img: 'expertImg4',
    freelancerName: 'Marvin Perry',
    location: 'Brooklyn, NY, USA',
    features: ['$50 - &150/hr', 'TOP INDEPENDENT', 'AVAILABLE'],
    services: ['Gardening', 'Handyman', 'Plumber', 'Plumber', 'Plumber'],
  },
  {
    id: uuidv4(),
    img: 'expertImg2',
    freelancerName: 'Marvin Lamb',
    location: 'Brooklyn, NY, USA',
    features: ['$75 - &120/hr', 'TOP INDEPENDENT', 'AVAILABLE'],
    services: ['Photography', 'Renovation', 'Plumber', 'Plumber'],
  },
  {
    id: uuidv4(),
    img: 'expertImg6',
    freelancerName: 'Bradley Pittman',
    location: 'Brooklyn, NY, USA',
    features: ['$25 - &120/hr', 'TOP INDEPENDENT', 'AVAILABLE'],
    services: ['Renovation', 'Cleaning', 'Plumber', 'Plumber'],
  },
  {
    id: uuidv4(),
    img: 'expertImg3',
    freelancerName: 'Alice Ortega',
    location: 'Brooklyn, NY, USA',
    features: ['$75 - &100/hr', 'TOP INDEPENDENT', 'AVAILABLE'],
    services: ['Renovation', 'Photography', 'Plumber', 'Plumber'],
  },
];
