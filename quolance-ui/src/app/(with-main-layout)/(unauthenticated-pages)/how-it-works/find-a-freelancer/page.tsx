'use client';
import { StarIcon, CheckIcon } from '@heroicons/react/20/solid';
import { InboxIcon, TrashIcon, UsersIcon, CheckCircleIcon, BriefcaseIcon, ShieldCheckIcon, PresentationChartLineIcon } from '@heroicons/react/24/outline';
import Link from "next/link";
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import heroImage1 from '@/public/images/freelancer-hero-img-1.jpg';


const features = [
  {
    name: 'Post Your Project',
    description:
      "Clearly outline your project requirements, including the skills and expertise needed. The more details you provide, the better matches you'll receive.",
    href: '#',
    icon: InboxIcon,
    color: 'bg-blue-500',
  },
  {
    name: 'Get Matched with Top Freelancers',
    description:
      'Our intelligent matching system suggests the best freelancers for your project. You can review profiles, portfolios, and ratings before making a decision.',
    href: '#',
    icon: UsersIcon,
    color: 'bg-indigo-500',
  },
  {
    name: 'Collaborate & Achieve Your Goals',
    description:
      "Once you've found the right freelancer, communicate directly, set milestones, and work together to complete your project on time and within budget.",
    href: '#',
    icon: CheckCircleIcon,
    color: 'bg-blue-600',
  },
];

const features2 = [
  {
    name: 'Curated Talent',
    description:
      'We ensure that only experienced and verified professionals are on our platform.',
    icon: BriefcaseIcon,
  },
  {
    name: 'Diverse Skill Sets',
    description:
      'Find experts across technology, design, marketing, writing, and more.',
    icon: PresentationChartLineIcon,
  },
  {
    name: 'Secure & Transparent',
    description:
      'Our process ensures smooth collaboration and trusted transactions.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Flexible & Scalable',
    description:
      'Hire for short-term tasks or long-term projects, based on your needs.',
    icon: UsersIcon,
  }
];

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

function FindAFreelancerPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section with Gradient Overlay */}
      <div className="relative bg-gradient-to-r from-gray-900 to-blue-900">
        <div className="relative overflow-hidden md:absolute md:left-0 md:h-full md:w-1/3 lg:w-1/2">
          {/* Image with gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-transparent z-10"></div>
          <img
            alt="Freelancer working on a project"
            src="https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            className="h-full w-full object-cover"
            data-test="hero-image-freelancer"
          />
        </div>
        
        <div className="relative mx-auto max-w-7xl py-24 sm:py-32 lg:px-8 lg:py-20">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="pl-6 pr-6 md:ml-auto md:w-2/3 md:pl-16 lg:w-1/2 lg:pl-24 lg:pr-0 xl:pl-32"
          >
            <div className="inline-flex items-center bg-blue-500/10 px-3 py-1 rounded-full mb-4">
              <div className="h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></div>
              <h2 data-test="hero-title-freelancer" className="text-sm font-semibold text-blue-400">
                Find Your Freelancer
              </h2>
            </div>
            
            <p data-test="hero-discover-freelancer" className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl leading-tight">
              Discover Top Talent <br className="hidden sm:block" />for Your Projects
            </p>
            
            <p data-test="hero-desc-freelancer" className="mt-6 text-base/7 text-gray-300 max-w-lg">
              Unlock a world of skilled professionals ready to bring your ideas to life. 
              Whether you need a developer, designer, marketer, or writer, our platform 
              connects you with the right talent to get the job done.
            </p>
            
            <div className="mt-10">
              <Link
                href="/projects"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-3.5 font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <span className="relative z-10 flex items-center">
                  <span data-test="browse-freelancer-btn">Browse Freelancers</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* How It Works Section with Cards */}
      <div className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left"
          >
            <div className="inline-flex items-center bg-indigo-50 px-3 py-1 rounded-full mb-4">
              <div className="h-2 w-2 rounded-full bg-indigo-500 mr-2"></div>
              <span className="text-sm font-semibold text-indigo-600">Simple Process</span>
            </div>
            <h2 data-test="how-it-works-title" className="text-pretty text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p data-test="follow-steps-subtitle" className="mt-4 text-lg/8 text-gray-600 max-w-xl mx-auto lg:mx-0">
              Follow these simple steps to find the perfect freelancer for your project.
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-16 lg:max-w-none"
          >
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div 
                  key={feature.name} 
                  variants={fadeIn}
                  className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                >
                  <dt data-test={`${feature.name}`} className="text-lg font-semibold text-gray-900">
                    <div className={`absolute -top-5 left-5 flex h-12 w-12 items-center justify-center rounded-xl ${feature.color} text-white shadow-md transition-transform group-hover:scale-110`}>
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                      <div className="absolute -inset-0.5 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="mt-4">{feature.name}</div>
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base text-gray-600">
                    <p data-test={`${feature.description.split(' ')[0]}`} className="flex-auto">{feature.description}</p>
                    <div className="mt-6">
                      <span className="text-sm text-blue-600 font-medium">{`0${index + 1}.`}</span>
                    </div>
                  </dd>
                </motion.div>
              ))}
            </dl>
          </motion.div>
        </div>
      </div>
      
      {/* Testimonial Section */}
      <div className="bg-white pt-16 pb-24 sm:pt-20 lg:pt-0">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.2" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 sm:py-24 relative">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="flex flex-col lg:flex-row lg:items-center gap-12"
            >
              <div className="lg:w-1/2">
                <div className="relative">
                  <div className="absolute -inset-1 bg-white/20 rounded-2xl blur-sm"></div>
                  <div className="absolute -top-3 -left-3 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-indigo-500/20 rounded-full blur-xl"></div>
                  
                  <Image
                    data-test="banner1-image"
                    alt="Successful freelancer"
                    src={heroImage1}
                    className="relative w-full rounded-2xl shadow-xl object-cover aspect-[16/9]"
                  />
                </div>
              </div>
              
              <div className="lg:w-1/2">
                <svg
                  className="h-12 w-12 text-white opacity-25 mb-6"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                >
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                
                <blockquote className="text-xl sm:text-2xl font-medium leading-relaxed text-white">
                  <p data-test="banner1-desc">
                    "This platform helped me connect with an incredible graphic designer who transformed my brand's identity. 
                    The process was smooth, and the results were amazing!"
                  </p>
                </blockquote>
                
                <div className="mt-8 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-lg font-semibold text-white">AJ</span>
                  </div>
                  <div>
                    <div data-test="banner1-client" className="font-semibold text-white">Isabella Johnson</div>
                    <div data-test="banner1-title" className="text-blue-200">Business Owner</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-5"
          >
            <div className="col-span-2">
              <div className="inline-flex items-center bg-blue-50 px-3 py-1 rounded-full mb-4">
                <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                <h2 data-test="banner2-title" className="text-sm font-semibold text-blue-600">
                  Why Choose Us?
                </h2>
              </div>
              
              <p data-test="banner2-slogan" className="mt-2 text-pretty text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Your Success, <br className="hidden sm:inline" />Our Priority
              </p>
              
              <p data-test="banner2-desc" className="mt-6 text-base/7 text-gray-600">
                We're committed to connecting you with the best freelance talent 
                to help you achieve your project goals efficiently and effectively.
              </p>
              
              <div className="mt-10 flex">
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`inline-block h-10 w-10 rounded-full ring-2 ring-white bg-gradient-to-br from-blue-${400 + i*100} to-indigo-${500 + i*100}`}>
                      <span className="sr-only">User</span>
                    </div>
                  ))}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-gray-900">Join 10,000+ businesses</p>
                  <p className="text-sm text-gray-500">that trust our freelance network</p>
                </div>
              </div>
            </div>
            
            <motion.dl 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="col-span-3 grid grid-cols-1 gap-x-8 gap-y-10 text-base/7 text-gray-600 sm:grid-cols-2 lg:gap-y-16"
            >
              {features2.map((feature) => (
                <motion.div key={feature.name} variants={fadeIn} className="relative">
                  <dt data-test={`${feature.name}`} className="font-semibold text-gray-900 flex items-center">
                    <div className="absolute left-0 top-1 mr-6 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <feature.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <span className="ml-14">{feature.name}</span>
                  </dt>
                  <dd data-test={`${feature.description.split(' ')[0]}`} className="mt-2 ml-14">{feature.description}</dd>
                </motion.div>
              ))}
            </motion.dl>
          </motion.div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:flex lg:items-center lg:justify-between lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 data-test="banner3-title" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to dive in? <br />
              <span className="text-blue-600">Start your project today.</span>
            </h2>
            <p className="mt-4 text-gray-600 max-w-xl">
              Join thousands of businesses who have found the perfect freelance talent for their projects.
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:shrink-0"
          >
            <Link
              href="/auth/register"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-3.5 font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg"
            >
              <span className="relative z-10 flex items-center">
                <span data-test="banner3-sign-up-btn">Sign Up For Free</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
            </Link>

            <Link
              href="#"
              className="text-sm font-semibold leading-6 text-gray-900 relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-blue-500 after:origin-bottom-right after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left after:transition-transform after:duration-300"
            >
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default FindAFreelancerPage;