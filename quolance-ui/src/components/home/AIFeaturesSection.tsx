'use client';
import React from 'react';
import { motion } from 'framer-motion';

// AI Features with real icons and descriptions
const aiFeatures: Array<{
  title: string;
  description: string;
  icon: JSX.Element;
  color: keyof typeof iconPlaceholders;
  delay: number;
}> = [
  {
    title: "AI-Powered Matching",
    description: "Our advanced AI analyzes your project requirements and matches you with the perfect freelancers who have the exact skills and experience you need.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M18.75 12.75h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zM12 6a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 6zM12 18a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 18zM3.75 6.75h1.5a.75.75 0 100-1.5h-1.5a.75.75 0 000 1.5zM5.25 18.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 010 1.5zM3 12a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 013 12zM9 3.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM12.75 12a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0zM9 15.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
      </svg>
    ),
    color: "blue",
    delay: 0.1
  },
  {
    title: "Smart Content Generation",
    description: "Create professional project descriptions, proposals, and profile content with our AI writing assistant - saving you time and helping you communicate clearly.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
      </svg>
    ),
    color: "purple",
    delay: 0.2
  },
  {
    title: "Automated Project Approval",
    description: "Our AI review system automatically validates project submissions against requirements, ensuring quality and consistency every time.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
      </svg>
    ),
    color: "indigo",
    delay: 0.3
  },
  {
    title: "24/7 AI Support Assistant",
    description: "Get instant answers to your questions anytime with our intelligent chatbot that understands context and provides helpful guidance.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
        <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
      </svg>
    ),
    color: "teal",
    delay: 0.4
  }
];

// Icon background colors
const iconPlaceholders = {
  blue: "bg-gradient-to-br from-blue-400 to-blue-600",
  purple: "bg-gradient-to-br from-purple-400 to-purple-600",
  indigo: "bg-gradient-to-br from-indigo-400 to-indigo-600",
  teal: "bg-gradient-to-br from-teal-400 to-teal-600"
};

export default function AIFeaturesSection() {
  return (
    <section className="relative overflow-hidden bg-white -mt-16 pt-32 pb-24">
        {/* Decorative elements that create visual connection to hero */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Larger gradient that extends toward the hero section */}
            <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-50 opacity-30 blur-3xl"></div>
            <div className="absolute top-60 -left-20 h-60 w-60 rounded-full bg-indigo-50 opacity-20 blur-3xl"></div>

            {/* Yellow accent that connects to hero's yellow elements */}
            <div className="absolute top-10 left-1/4 h-8 w-8 rounded-full bg-yellow-400 opacity-30 blur-md"></div>

            {/* Subtle circuit pattern that flows from top */}
            <svg width="100%" height="100%" className="absolute inset-0 text-gray-100/20 opacity-10" style={{ mixBlendMode: 'overlay' }}>
            <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M0 50 H100 M50 0 V100 M25 25 H75 M25 75 H75" stroke="currentColor" strokeWidth="0.5" fill="none" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
            </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <div className="inline-flex items-center bg-blue-50 px-3 py-1 rounded-full mb-4">
                <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-sm font-semibold text-blue-600">AI-Powered Platform</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Intelligent Features That <br className="hidden sm:inline" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    Transform How You Work
                </span>
                </h2>
                <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
                Our platform leverages cutting-edge artificial intelligence to streamline your workflow,
                match you with the perfect talent, and help you achieve better results.
                </p>
            </motion.div>
            </div>

        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:gap-x-16 lg:gap-y-16">
            {aiFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay, duration: 0.5 }}
                whileHover={{ 
                  scale: 1.03,
                  transition: { type: "spring", stiffness: 300, damping: 10 }
                }}
                className="relative"
              >
                <motion.div 
                  className="flex bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                  initial={{ borderRadius: "0.75rem" }}
                  whileHover={{ borderRadius: "1rem" }}
                >
                  {/* Icon with animated gradient background */}
                  <motion.div 
                    className={`flex-shrink-0 h-14 w-14 rounded-xl ${iconPlaceholders[feature.color]} flex items-center justify-center shadow-md`}
                    whileHover={{ 
                      scale: 1.1,
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{ 
                      rotate: { repeat: Infinity, duration: 1.5 },
                      scale: { type: "spring", stiffness: 300 }
                    }}
                  >
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </motion.div>

                  <div className="ml-5">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-base text-gray-600">
                      {feature.description}
                    </p>
                  </div> 
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Abstract AI visualization */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-24 relative mx-auto max-w-5xl"
        >
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl border border-indigo-100">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900"></div>
            
            {/* Neural network visualization */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="100%" height="100%" viewBox="0 0 800 450" className="absolute inset-0">
                {/* Connecting lines */}
                <g stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1">
                  {/* Layer 1 to Layer 2 connections */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    Array.from({ length: 7 }).map((_, j) => (
                      <motion.line
                        key={`l1-l2-${i}-${j}`}
                        x1={200}
                        y1={100 + i * 60}
                        x2={400}
                        y2={80 + j * 45}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + (i * 0.1 + j * 0.03) }}
                      />
                    ))
                  ))}
                  
                  {/* Layer 2 to Layer 3 connections */}
                  {Array.from({ length: 7 }).map((_, i) => (
                    Array.from({ length: 3 }).map((_, j) => (
                      <motion.line
                        key={`l2-l3-${i}-${j}`}
                        x1={400}
                        y1={80 + i * 45}
                        x2={600}
                        y2={150 + j * 75}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 + (i * 0.05 + j * 0.08) }}
                      />
                    ))
                  ))}
                </g>
                
                {/* Data flow pulses */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.circle
                    key={`pulse-${i}`}
                    r="3"
                    fill="rgba(255, 255, 255, 0.6)"
                    initial={{ 
                      cx: 200, 
                      cy: 100 + (i % 5) * 60, 
                      opacity: 0 
                    }}
                    animate={{ 
                      cx: 600, 
                      cy: 150 + (i % 3) * 75, 
                      opacity: [0, 1, 0] 
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      delay: i * 0.8,
                      ease: "easeInOut"
                    }}
                  />
                ))}
                
                {/* Layer 1 nodes (input) */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.circle
                    key={`l1-${i}`}
                    cx={200}
                    cy={100 + i * 60}
                    r="8"
                    fill="rgba(59, 130, 246, 0.8)"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                  />
                ))}
                
                {/* Layer 2 nodes (hidden) */}
                {Array.from({ length: 7 }).map((_, i) => (
                  <motion.circle
                    key={`l2-${i}`}
                    cx={400}
                    cy={80 + i * 45}
                    r="6"
                    fill="rgba(139, 92, 246, 0.8)"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  />
                ))}
                
                {/* Layer 3 nodes (output) */}
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.circle
                    key={`l3-${i}`}
                    cx={600}
                    cy={150 + i * 75}
                    r="10"
                    fill="rgba(99, 102, 241, 0.8)"
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth="2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9 + i * 0.15 }}
                  />
                ))}
              </svg>
              
              {/* Central AI text/symbol */}
              <div className="relative z-10 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="text-white text-5xl font-bold tracking-wide mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-white to-indigo-300">
                    AI POWERED
                  </div>
                  <div className="text-blue-200 text-lg max-w-md mx-auto">
                    Intelligent matching, content generation, and automated workflows that learn and adapt to your needs
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Animated particles */}
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute bg-white rounded-full opacity-40"
                initial={{ 
                  x: Math.random() * 1000, 
                  y: Math.random() * 500,
                  width: Math.random() * 4 + 1,
                  height: Math.random() * 4 + 1,
                }}
                animate={{ 
                  x: Math.random() * 1000, 
                  y: Math.random() * 500,
                }}
                transition={{ 
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "linear"
                }}
              />
            ))}
          </div>
          
          {/* Yellow accent to match hero yellow elements */}
          <div className="absolute -top-6 -right-6 h-10 w-10 rounded-full bg-yellow-400 opacity-50"></div>
          <div className="absolute -bottom-6 -left-6 h-14 w-14 rounded-full bg-blue-100 opacity-80"></div>
        </motion.div>
      </div>
    </section>
  );
}