'use client';
import { useState, useEffect } from 'react';
import heroImage1 from '@/public/images/freelancer-hero-img-1.jpg';
import Image from 'next/image';
import Link from 'next/link';

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
        <div
          aria-hidden='true'
          className='absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl ring-1 ring-indigo-50 sm:-mr-80 lg:-mr-96'
        />
        <div className='mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8'>
          <div className='mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-8 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8'>
            <h1 data-test="hero-title" className='max-w-2xl text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl lg:col-span-2 xl:col-auto'>
              We’re Changing The Way You Find{' '}
              <span style={{ display: 'inline-block', minWidth: '11ch' }}>
                {text}
                <span className="blinking-cursor">|</span>
              </span>
            </h1>
            <div className='mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1'>
              <p data-test="hero-desc" className='text-pretty text-lg font-medium text-gray-500 sm:text-xl/8'>
                Find trusted freelancers and contractors with ease. Our extensive network of skilled local experts—from programming and design to writing and beyond—is here to help you succeed, no matter the project.
              </p>
              <div className='mt-10 flex items-center gap-x-6'>
                <Link
                  href='/auth/register'
                  className='bg-b300 hover:text-n900 px-8 py-3 relative flex items-center justify-center overflow-hidden rounded-full font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)]'
                >
                  <span data-test="sign-up-btn-hero" className='relative z-10'>Sign Up For Free</span>
                </Link>
                <Link data-test="project-catalog-btn-hero" href='/projects' className='text-sm/6 font-semibold text-gray-900'>
                  Projects Catalog <span aria-hidden='true'>→</span>
                </Link>
              </div>
            </div>
            <Image
              data-test="hero-image"
              alt=''
              src={heroImage1}
              className='mt-10 aspect-[6/5] w-full max-w-lg rounded-2xl object-cover sm:mt-16 lg:mt-0 lg:max-w-none xl:row-span-2 xl:row-end-2 xl:mt-36'
            />
          </div>
        </div>
        <div className='absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white sm:h-32' />
      </div>
    </div>
  );
}
