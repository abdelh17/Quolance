'use client';
import { useState, useEffect } from 'react';
import heroImage1 from '@/public/images/freelancer-hero-img-1.jpg';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const words = ['Freelancers', 'Contractors'];
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const typingSpeed = 150;    // ms per character when typing
  const deletingSpeed = 50;   // ms per character when deleting
  const pauseDuration = 1000; // pause duration after a word is fully typed

  useEffect(() => {
    const currentWord = words[wordIndex];
    let timeoutId: ReturnType<typeof setTimeout>;

    if (!isDeleting && text === currentWord) {
      // Pause before starting to delete
      timeoutId = setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);
    } else if (isDeleting && text === '') {
      // Move to the next word when deletion is complete
      setIsDeleting(false);
      setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    } else {
      timeoutId = setTimeout(() => {
        setText((prevText) =>
          isDeleting
            ? currentWord.substring(0, prevText.length - 1)
            : currentWord.substring(0, prevText.length + 1)
        );
      }, isDeleting ? deletingSpeed : typingSpeed);
    }

    return () => clearTimeout(timeoutId);
  }, [text, isDeleting, wordIndex]);

  // Animation variants
  const containerVariants = {
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
    <div className="relative overflow-hidden bg-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{ 
            opacity: [0.7, 0.9, 0.7],
            scale: [1, 1.02, 1]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-gradient-to-r from-white to-blue-50/40 shadow-xl sm:-mr-80 lg:-mr-96"
        />
        
        {/* Decorative elements */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute top-40 left-1/5 h-72 w-72 rounded-full bg-blue-50 opacity-40 blur-3xl"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="absolute -bottom-20 right-1/4 h-64 w-64 rounded-full bg-indigo-50/80 opacity-30 blur-3xl"
        />
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.015]"></div>
      </div>
      
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-10"
        >
          {/* Text content - left side */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.h1 
                data-test="hero-title" 
                className="max-w-2xl text-balance text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl"
              >
                <span className="block">We're Changing The Way</span>
                <span className="block mt-2">You Find{' '}
                  <span className="relative inline-block">
                    <span style={{ minWidth: '11ch' }} className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {text}
                      <span className="blinking-cursor text-blue-600">|</span>
                    </span>
                    <motion.div 
                      className="absolute -bottom-2 left-0 h-1.5 bg-yellow-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                    ></motion.div>
                  </span>
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                data-test="hero-desc" 
                className="mt-6 max-w-xl text-pretty text-lg leading-8 text-gray-600"
              >
                Find trusted freelancers and contractors with ease. Our extensive network of skilled local experts—from programming and design to writing and beyond—is here to help you succeed, no matter the project.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4"
              >
                <Link
                  href="/auth/register"
                  className="relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3.5 font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg group"
                >
                  <span data-test="sign-up-btn-hero" className="relative z-10 flex items-center">
                    Sign Up For Free
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                </Link>
                
                <Link 
                  data-test="project-catalog-btn-hero" 
                  href="/projects" 
                  className="group flex items-center text-sm font-semibold text-gray-900"
                >
                  <span className="relative">
                    Projects Catalog 
                    <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r from-blue-400 to-indigo-400 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Image - right side with floating animation */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 sm:mt-24 lg:col-span-5 lg:mt-0"
          >
            <motion.div 
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="relative"
            >
              {/* Glowing effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-lg transform -rotate-2"></div>
              
              {/* Card container */}
              <div className="relative transform rotate-2 hover:rotate-0 transition-transform duration-700">
                <div className="absolute -inset-1 bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 rounded-2xl blur"></div>
                <div className="absolute -inset-2 bg-white/30 rounded-2xl"></div>
                <div className="absolute -inset-0.5 bg-white rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.3)]"></div>
                
                <div className="relative overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    data-test="hero-image"
                    alt="Freelancer working"
                    src={heroImage1}
                    className="w-full h-full object-cover"
                    priority
                  />
                  
                  {/* Subtle image overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-indigo-500/10"></div>
                  
                  {/* Yellow corner accent */}
                  <div className="absolute top-0 right-0 w-16 h-16">
                    <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
                      <div className="absolute -top-1 -right-1 w-10 h-10 bg-yellow-400 rotate-6"></div>
                    </div>
                  </div>
                  
                  {/* Blue corner accent */}
                  <div className="absolute bottom-0 left-0 w-16 h-16">
                    <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden">
                      <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-blue-500/40 -rotate-6"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative dots */}
              <div className="absolute -right-6 top-1/4 flex flex-col gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500/60"></div>
                <div className="h-2 w-2 rounded-full bg-indigo-500/60"></div>
                <div className="h-2 w-2 rounded-full bg-blue-500/60"></div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
}