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

  return (
    <div className='bg-white'>
      <div className='relative isolate overflow-hidden bg-gradient-to-b'>
        {/* Enhanced skewed background with subtle animation */}
        <motion.div
          animate={{ 
            opacity: [0.9, 1, 0.9],
            scale: [1, 1.01, 1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          aria-hidden='true'
          className='absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl ring-1 ring-indigo-50 sm:-mr-80 lg:-mr-96'
        />
        
        {/* Subtle decorative elements */}
        <div className="absolute top-32 left-1/4 h-64 w-64 rounded-full bg-blue-50 opacity-40 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 h-40 w-40 rounded-full bg-indigo-50 opacity-30 blur-3xl"></div>
        
        <div className='mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8'>
          <div className='lg:grid lg:grid-cols-12 lg:items-center lg:gap-8'>
            {/* Text content - left side */}
            <div className='lg:col-span-7'>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                data-test="hero-title" 
                className='max-w-2xl text-balance text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl'
              >
                We're Changing The Way You Find{' '}
                <span className="relative inline-block">
                  <span style={{ minWidth: '11ch' }} className="inline-block text-blue-500">
                    {text}
                    <span className="blinking-cursor">|</span>
                  </span>
                  <motion.div 
                    className="absolute -bottom-2 left-0 h-1.5 bg-yellow-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  ></motion.div>
                </span>
              </motion.h1>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className='mt-6 max-w-xl'
              >
                <p data-test="hero-desc" className='text-pretty text-lg leading-8 text-gray-600'>
                  Find trusted freelancers and contractors with ease. Our extensive network of skilled local experts—from programming and design to writing and beyond—is here to help you succeed, no matter the project.
                </p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className='mt-10 flex items-center gap-x-6'
                >
                  <Link
                    href='/auth/register'
                    className='bg-blue-500 hover:bg-blue-600 px-8 py-3.5 relative flex items-center justify-center overflow-hidden rounded-full font-semibold text-white shadow-md transition-all duration-300 group'
                  >
                    <span data-test="sign-up-btn-hero" className='relative z-10 flex items-center'>
                      Sign Up For Free
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="absolute inset-0 bg-yellow-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                  </Link>
                  
                  <Link 
                    data-test="project-catalog-btn-hero" 
                    href='/projects' 
                    className='text-sm font-semibold text-gray-900 relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-blue-400 after:origin-bottom-right after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left after:transition-transform after:duration-300'
                  >
                    Projects Catalog <span aria-hidden='true'>→</span>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Image - right side */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-16 sm:mt-24 lg:col-span-5 lg:mt-0"
            >
              {/* Enhanced image container with better shadow */}
              <div className="relative transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="absolute -inset-1 bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 rounded-2xl blur"></div>
                <div className="absolute -inset-2 bg-white/30 rounded-2xl"></div>
                <div className="absolute -inset-0.5 bg-white rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.2)]"></div>
                
                <div className="relative overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    data-test="hero-image"
                    alt='Freelancer working'
                    src={heroImage1}
                    className='w-full h-full object-cover'
                    priority
                  />
                  
                  {/* Subtle image overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-indigo-500/10"></div>
                  
                  {/* Corner accents */}
                  <div className="absolute top-0 right-0 w-16 h-16">
                    <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
                      <div className="absolute -top-1 -right-1 w-8 h-8 bg-yellow-400 rotate-6"></div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 w-16 h-16">
                    <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden">
                      <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-blue-500/30 -rotate-6"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className='absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white sm:h-32' />
      </div>
    </div>
  );
}