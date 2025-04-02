'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Sample testimonial data
const testimonials = [
  {
    quote: "Quolance's AI matched me with an incredible developer who understood exactly what I needed. The project was completed ahead of schedule and exceeded my expectations.",
    author: "Sarah Johnson",
    role: "Founder",
    company: "Bloom Marketing",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    rating: 5
  },
  {
    quote: "As a freelancer, I've found amazing clients through this platform. The AI-powered matching ensures I get projects that perfectly align with my skills and experience.",
    author: "Michael Chen",
    role: "Full-Stack Developer",
    company: "Independent",
    image: "https://randomuser.me/api/portraits/men/26.jpg",
    rating: 5
  },
  {
    quote: "The AI content generator helped me create a professional profile that stands out. Since updating my profile, I've received three times more client inquiries!",
    author: "Alex Rivera",
    role: "UX Designer",
    company: "DesignCraft",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5
  },
  {
    quote: "I was skeptical about AI-assisted project matching, but after my first project through Quolance, I'm a believer. The platform saved me countless hours finding the right talent.",
    author: "David Wilson",
    role: "Product Manager",
    company: "TechStart Inc.",
    image: "https://randomuser.me/api/portraits/men/42.jpg",
    rating: 5
  }
];

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState('next');
  const testimonialsRef = useRef(null);
  const autoPlayRef = useRef<() => void>();

  // Set up auto-scrolling
  useEffect(() => {
    const autoScroll = () => {
      setDirection('next');
      setActive((prev) => (prev + 1) % testimonials.length);
    };
    
    autoPlayRef.current = () => autoScroll();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (autoPlayRef.current) {
        autoPlayRef.current();
      }
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setDirection('next');
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection('prev');
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

// Animation variants
const variants = {
    enter: (direction: string) => ({
        x: direction === 'next' ? 200 : -200,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: string) => ({
        x: direction === 'next' ? -200 : 200,
        opacity: 0,
    }),
};

  return (
    <section className="relative overflow-hidden bg-white pt-20 pb-24">
      {/* Decorative elements - matching other sections */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-50 opacity-30 blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-purple-50 opacity-40 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-indigo-50 opacity-30 blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 h-48 w-48 rounded-full bg-teal-50 opacity-30 blur-2xl"></div>
        
        {/* Subtle circuit pattern to match AI section */}
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
              <span className="text-sm font-semibold text-blue-600">Success Stories</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              What Our Users <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Say About Us
              </span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied clients and freelancers who have found success 
              on our AI-powered platform.
            </p>
          </motion.div>
        </div>
        
        <div className="mt-16 relative max-w-5xl mx-auto" ref={testimonialsRef}>
          <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100 sm:p-8 lg:p-12">
            {/* Custom gradient background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 via-white to-indigo-50 opacity-100"></div>
            
            {/* Enhanced quote icon */}
            <svg
              className="absolute top-8 left-8 h-14 w-14 text-blue-200"
              fill="currentColor"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>
            
            {/* Testimonial carousel */}
            <div className="relative h-full">
              <motion.div
                key={active}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="relative z-10 text-center p-6 pt-20 sm:p-8 lg:px-20 lg:pt-24"
              >
                <p className="mx-auto max-w-3xl text-xl sm:text-2xl font-medium italic text-gray-900 leading-relaxed">
                  "{testimonials[active].quote}"
                </p>
                
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <div className="flex-shrink-0">
                    <Image
                      className="h-16 w-16 rounded-full border-2 border-white shadow-lg"
                      src={testimonials[active].image}
                      alt={testimonials[active].author}
                      width={64}
                      height={64}
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="font-bold text-xl text-gray-900">{testimonials[active].author}</div>
                    <div className="text-blue-600 text-sm font-medium">{testimonials[active].role}</div>
                    <div className="text-gray-500 text-sm">{testimonials[active].company}</div>
                  </div>
                </div>
                
                {/* Rating stars with improved styling */}
                <div className="mt-5 flex justify-center">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </motion.div>
            </div>
            
            {/* Enhanced navigation dots */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 sm:bottom-10 sm:gap-4 lg:bottom-14">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > active ? 'next' : 'prev');
                    setActive(index);
                  }}
                  className={`h-3 w-3 rounded-full transition-all duration-300 hover:bg-blue-400 ${
                    index === active ? 'bg-blue-600 scale-125' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Enhanced Prev/Next buttons */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 shadow-lg hover:bg-white hover:shadow-xl transition-all"
              aria-label="Previous testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 shadow-lg hover:bg-white hover:shadow-xl transition-all"
              aria-label="Next testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}