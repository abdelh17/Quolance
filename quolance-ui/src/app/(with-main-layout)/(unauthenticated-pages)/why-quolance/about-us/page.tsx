'use client'

import { motion } from 'framer-motion';
import {
  RocketLaunchIcon,
  HandRaisedIcon,
  UserGroupIcon,
  SparklesIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

const values = [
  {
    name: 'Quality First',
    description: 'We maintain high standards in our marketplace by carefully vetting freelancers and ensuring top-quality deliverables.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Global Opportunity',
    description: 'Connect talent with opportunities worldwide, breaking down geographical barriers in the digital workforce.',
    icon: GlobeAltIcon,
  },
  {
    name: 'Fair & Transparent',
    description: 'Clear pricing, zero hidden fees, and secure payment protection for both clients and freelancers.',
    icon: HandRaisedIcon,
  },
  {
    name: 'Community Driven',
    description: 'Building a supportive ecosystem where freelancers and clients can grow and succeed together.',
    icon: UserGroupIcon,
  },
  {
    name: 'Innovation',
    description: 'Continuously improving our platform with cutting-edge features to enhance the freelancing experience.',
    icon: SparklesIcon,
  },
  {
    name: 'Empowering Growth',
    description: 'Providing the tools and support needed for both freelancers and clients to achieve their goals.',
    icon: RocketLaunchIcon,
  },
]

export default function AboutPage() {
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
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-white via-blue-50/20 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
      <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-blue-100 opacity-30 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-40 right-10 h-60 w-60 rounded-full bg-indigo-100 opacity-20 blur-3xl pointer-events-none"></div>
      
      <main className="relative isolate">
        {/* Header section */}
        <div className="mx-auto pt-24 pb-16 max-w-7xl px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="mx-auto max-w-2xl lg:mx-0 lg:max-w-3xl"
          >
            <div className="inline-flex items-center bg-blue-50 px-3 py-1 rounded-full mb-4">
              <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
              <span data-test="header-title" className="text-sm font-semibold text-blue-600">About Quolance</span>
            </div>
            
            <h1 
              data-test="header-slogan" 
              className="mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              Connecting Talent with Opportunity
            </h1>
            
            <p 
              data-test="header-desc" 
              className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl"
            >
              We're building the future of work by empowering businesses to connect with top freelance talent globally. 
              Our platform makes it simple to find, hire, and work with the best professionals around the world.
            </p>
          </motion.div>
        </div>

        {/* Mission statement with visual divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-lg font-medium text-white rounded-full">Our Mission</span>
          </div>
        </div>

        {/* Content section */}
        <div className="mx-auto mt-16 max-w-7xl px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none"
          >
            <div className="grid max-w-xl grid-cols-1 gap-x-12 gap-y-8 text-lg leading-7 text-gray-700 lg:max-w-none lg:grid-cols-2">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p data-test="content-section-desc1">
                  At Quolance, we believe in the power of remote work and the unlimited potential it brings. Our platform 
                  bridges the gap between talented freelancers and businesses seeking expertise, creating opportunities 
                  that transcend geographical boundaries.
                </p>
                <p data-test="content-section-desc2" className="mt-6">
                  We've built a marketplace that prioritizes quality, transparency, and fair practices. Our commitment 
                  to these values has helped us create a thriving community where both clients and freelancers can achieve 
                  their goals.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p data-test="content-section-desc3">
                  Our platform is designed to make the hiring process seamless and secure. We provide the tools and 
                  support needed to ensure successful collaboration, from project inception to completion.
                </p>
                <p data-test="content-section-desc4" className="mt-6">
                  Whether you're a business looking to scale or a freelancer ready to showcase your skills, Quolance 
                  provides the platform you need to succeed in today's digital economy.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Values section */}
        <div className="mx-auto mt-24 max-w-7xl px-6 lg:px-8 pb-24">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mx-auto max-w-2xl lg:mx-0"
          >
            <div className="inline-flex items-center bg-blue-50 px-3 py-1 rounded-full mb-4">
              <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm font-semibold text-blue-600">Our Foundation</span>
            </div>
            
            <h2 
              data-test="value-section-title" 
              className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            >
              Core Values That Drive Us
            </h2>
            
            <p 
              data-test="value-section-slogan" 
              className="mt-6 text-lg leading-8 text-gray-600"
            >
              These core principles guide everything we do at Quolance, from platform development to community support.
            </p>
          </motion.div>
          
          <motion.dl 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
          >
            {values.map((value) => (
              <motion.div 
                key={value.name} 
                variants={fadeIn}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                    <value.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <dt data-test={`${value.name}`} className="ml-4 text-lg font-semibold text-gray-900">
                    {value.name}
                  </dt>
                </div>
                <dd data-test={`${value.description.split(' ')[0]}`} className="text-base text-gray-600 ml-0">
                  {value.description}
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </main>
    </div>
  )
}