'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeBracketIcon, PaintBrushIcon, PencilIcon, ChartBarIcon, FilmIcon, BriefcaseIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

// Icon background colors matching the AI Features section style
const iconBackgrounds = {
  blue: "bg-gradient-to-br from-blue-400 to-blue-600",
  purple: "bg-gradient-to-br from-purple-400 to-purple-600",
  indigo: "bg-gradient-to-br from-indigo-400 to-indigo-600",
  teal: "bg-gradient-to-br from-teal-400 to-teal-600",
  yellow: "bg-gradient-to-br from-yellow-400 to-amber-500",
  orange: "bg-gradient-to-br from-orange-400 to-red-500"
};

// Features for each category
const categoryFeatures = {
  "Web Development": ["Responsive Design", "E-commerce", "CMS Integration", "API Development"],
  "Graphic Design": ["Logo Design", "UI/UX", "Marketing Materials", "Brand Identity"],
  "Content Writing": ["Blog Posts", "SEO Content", "Technical Writing", "Copywriting"],
  "Digital Marketing": ["SEO", "SEM", "Social Media", "Analytics"],
  "Video Production": ["Motion Graphics", "Video Editing", "Animation", "Explainer Videos"],
  "Business Consulting": ["Market Research", "Business Strategy", "Financial Analysis", "Process Optimization"]
};

// Categories with styling that matches AI Features section
const categories: Category[] = [
  { 
    name: "Web Development", 
    description: "Custom websites & applications",
    icon: CodeBracketIcon, 
    color: "blue",
    delay: 0.1
  },
  { 
    name: "Graphic Design", 
    description: "Visual branding & creative illustrations",
    icon: PaintBrushIcon, 
    color: "purple",
    delay: 0.2
  },
  { 
    name: "Content Writing", 
    description: "Engaging articles & marketing copy",
    icon: PencilIcon, 
    color: "indigo",
    delay: 0.3
  },
  { 
    name: "Digital Marketing", 
    description: "Growth strategies & optimization",
    icon: ChartBarIcon, 
    color: "teal",
    delay: 0.4
  },
  { 
    name: "Video Production", 
    description: "Professional video editing & animation",
    icon: FilmIcon, 
    color: "orange",
    delay: 0.5
  },
  { 
    name: "Business Consulting", 
    description: "Strategic planning & market analysis",
    icon: BriefcaseIcon, 
    color: "yellow",
    delay: 0.6
  }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 10 }
  }
};

interface Category {
  name: string;
  description: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement> & React.RefAttributes<SVGSVGElement>>;
  color: keyof typeof iconBackgrounds;
  delay: number;
}

const CategoryCard = ({ category }: { category: Category }) => {
  const { name, description, icon: Icon, color } = category;
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Get features for this category
  const features = categoryFeatures[name as keyof typeof categoryFeatures] || [];
  
  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ 
        scale: 1.03,
        transition: { type: "spring", stiffness: 300, damping: 10 }
      }}
      className="group relative"
    >
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 rounded-xl"
        aria-expanded={isExpanded}
      >
        <div className={`relative overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100 transition-all duration-300 ${isExpanded ? 'shadow-lg border-blue-200' : 'group-hover:shadow-lg'} h-full`}>
          {/* Colored accent bar */}
          <div className="absolute top-0 left-0 h-1 w-full">
            <div className={`absolute inset-0 ${iconBackgrounds[color]}`}></div>
          </div>
          
          <div className="p-8 text-center">
            {/* Icon with animation */}
            <motion.div 
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl overflow-hidden"
              whileHover={{ 
                scale: 1.1,
                rotate: [0, 5, -5, 0],
              }}
              animate={isExpanded ? { 
                scale: 1.1,
                transition: { type: "spring", stiffness: 300 }
              } : {}}
              transition={{ 
                rotate: { repeat: Infinity, duration: 1.5 },
                scale: { type: "spring", stiffness: 300 }
              }}
            >
              <div className={`absolute inset-0 ${iconBackgrounds[color]}`}></div>
              <Icon className="h-7 w-7 text-white relative z-10" aria-hidden="true" />
            </motion.div>
            
            {/* Title and description */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
            
            {/* Expand/collapse indicator */}
            <div className="mt-4 flex justify-center">
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className={`p-1 rounded-full ${isExpanded ? 'bg-blue-100' : 'bg-gray-100'} inline-flex`}
              >
                <ChevronDownIcon className={`h-5 w-5 ${isExpanded ? 'text-blue-600' : 'text-gray-500'}`} />
              </motion.div>
            </div>
            
            {/* Expanded content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="font-medium text-gray-900 mb-2">Services Include:</h4>
                    <ul className="space-y-2 text-left">
                      {features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <div className={`h-2 w-2 rounded-full mt-1.5 ${iconBackgrounds[color]} mr-2 flex-shrink-0`}></div>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </button>
    </motion.div>
  );
};

export default function FeaturedCategoriesSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/10 to-white pt-20 pb-24">
      {/* Decorative elements - matching AI Features section */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-40 h-80 w-80 rounded-full bg-blue-50 opacity-30 blur-3xl"></div>
        <div className="absolute bottom-20 -right-20 h-60 w-60 rounded-full bg-indigo-50 opacity-20 blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 h-64 w-64 rounded-full bg-purple-50 opacity-10 blur-3xl"></div>
        
        {/* Subtle circuit pattern - less opacity to blend with hero */}
        <svg width="100%" height="100%" className="absolute inset-0 text-gray-100/20 opacity-10" style={{ mixBlendMode: 'overlay' }}>
          <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M0 50 H100 M50 0 V100 M25 25 H75 M25 75 H75" stroke="currentColor" strokeWidth="0.5" fill="none" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
        </svg>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center bg-blue-50 px-3 py-1.5 rounded-full mb-5">
              <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm font-semibold text-blue-600">Our Services</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
              Discover Top <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Categories
              </span>
            </h2>
            <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
              Find the perfect freelance services for your business needs,
              all powered by our intelligent matching algorithm.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3"
        >
          {categories.map((category) => (
            <CategoryCard key={category.name} category={category} />
          ))}
        </motion.div>
        
        {/* Optional help text for mobile users */}
        <div className="mt-8 text-center text-sm text-gray-500 md:hidden">
          Tap any category to see more details
        </div>
      </div>
    </section>
  );
}