'use client';

import React from 'react';
import { StarIcon } from '@heroicons/react/20/solid';
import { UserIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

const reviews = [
  {
    id: 1,
    name: 'Benjamin Foster',
    role: 'Senior Frontend Developer | Contract',
    rating: 5,
    comment: "Very pleased with the service. Quolance is the go-to for quality freelancing. Professional platform that connects you with the best clients out there.",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80",
  },
  {
    id: 2,
    name: 'Sofia Rodriguez',
    role: 'UI/UX Design Contractor',
    rating: 5,
    comment: "Quolance has connected me with top-notch freelancers. The quality of work and communication has been exceptional.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80",
  },
  {
    id: 3,
    name: 'James Chen',
    role: 'Full Stack Developer | Freelancer',
    rating: 5,
    comment: "The platform is intuitive and the talent pool is impressive. I've found amazing freelancers for various projects.",
    image: "https://images.unsplash.com/photo-1579017331263-ef82f0bbc748?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=900&h=900&q=80",
  },
  {
    id: 4,
    name: 'Emily Parker',
    role: 'Product Designer | Freelancer',
    rating: 5,
    comment: "As a creative professional, I appreciate the high standards maintained by Quolance. The platform has been instrumental in scaling our team.",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80",
  },
  {
    id: 5,
    name: 'Marcus Thompson',
    role: 'Mobile App Developer | Contract',
    rating: 5,
    comment: "The freelancers on Quolance are truly exceptional. Every project has been delivered with outstanding quality.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80",
  },
  {
    id: 6,
    name: 'Aisha Patel',
    role: 'Backend Developer | Freelancer',
    rating: 5,
    comment: "Quolance made it easy to find specialized talent for our startup. The quality of work has consistently exceeded our expectations.",
    image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80",
  },
];

const ReviewsPage = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="bg-gradient-to-b from-white via-blue-50/10 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
      <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-blue-100 opacity-30 blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-10 h-60 w-60 rounded-full bg-indigo-100 opacity-20 blur-3xl pointer-events-none"></div>
      
      {/* Hero Section */}
      <div className="relative px-6 lg:px-8 pt-24 pb-16">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center bg-blue-50 px-3 py-1 rounded-full mb-5">
            <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-sm font-semibold text-blue-600">Testimonials</span>
          </div>
          
          <h1 
            data-test="hero-section-title" 
            className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            Client Success Stories
          </h1>
          
          <p 
            data-test="hero-section-desc" 
            className="mt-6 text-xl leading-8 text-gray-600 max-w-2xl mx-auto"
          >
            Discover how Quolance has helped businesses and freelancers achieve their goals. 
            Our platform has enabled countless successful collaborations and projects.
          </p>
        </motion.div>
      </div>

      {/* Stats section */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="pb-16"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  </div>
                </div>
                <div className="text-4xl font-bold tracking-tight text-gray-900">1,000+</div>
                <div className="mt-1 text-base text-gray-600">Happy Clients</div>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <ChatBubbleLeftRightIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                  </div>
                </div>
                <div className="text-4xl font-bold tracking-tight text-gray-900">98%</div>
                <div className="mt-1 text-base text-gray-600">Satisfaction Rate</div>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <StarIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  </div>
                </div>
                <div className="text-4xl font-bold tracking-tight text-gray-900">4.9/5</div>
                <div className="mt-1 text-base text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Reviews Section */}
      <div className="relative py-16 sm:py-24">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="mx-auto max-w-7xl px-6 lg:px-8 mb-12"
        >
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              What Our Users Are Saying
            </h2>
            <p data-test="reviews-section-desc" className="mt-4 text-lg leading-8 text-gray-600">
              Real feedback from businesses and freelancers who use Quolance every day
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Swiper
              modules={[EffectCoverflow, Pagination, Autoplay]}
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              loop={true}
              slidesPerView={3}
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 100,
                modifier: 2.5,
                slideShadows: false,
              }}
              pagination={{ 
                clickable: true,
                bulletActiveClass: 'swiper-pagination-bullet-active bg-blue-600',
                bulletClass: 'swiper-pagination-bullet bg-gray-300 inline-block rounded-full h-2.5 w-2.5 mx-1.5 opacity-100'
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              className="pb-16"
              breakpoints={{
                320: {
                  slidesPerView: 1,
                },
                640: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
            >
              {reviews.map((review) => (
                <SwiperSlide key={review.id} className="px-4 pb-8">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
                    <div className="flex gap-1 mb-6">
                      {[...Array(review.rating)].map((_, i) => (
                        <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                      ))}
                    </div>
                    
                    <p data-test={`${review.comment.split(' ')[0]}`} className="text-gray-700 font-medium italic flex-grow">"{review.comment}"</p>
                    
                    <div className="flex items-center gap-x-4 mt-6 pt-6 border-t border-gray-100">
                      <img src={review.image} alt="" className="h-12 w-12 rounded-full bg-gray-100 object-cover" />
                      <div>
                        <h3 data-test={`${review.name}`} className="text-base font-semibold text-gray-900">{review.name}</h3>
                        <p data-test={`${review.role}`} className="text-sm text-gray-600">{review.role}</p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="relative mx-auto max-w-7xl px-6 py-16 sm:py-24 mb-8"
      >
        <div className="overflow-hidden rounded-3xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-16 sm:px-16 sm:py-20 lg:flex lg:items-center lg:justify-between lg:gap-x-8 relative">
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
            
            <div>
              <h2 data-test="cta-section-title" className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to experience the difference?
                <br />
                <span className="text-blue-200">Join our growing community today.</span>
              </h2>
              <p className="mt-4 text-lg text-blue-100 max-w-xl">
                Connect with top talent or find exciting projects on our AI-powered platform designed for successful collaborations.
              </p>
            </div>
            
            <div className="mt-10 lg:mt-0 z-10">
              <a
                href="/auth/register"
                className="relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white px-8 py-3.5 text-lg font-semibold text-blue-600 shadow-md transition-all duration-300 hover:bg-yellow-400 hover:text-blue-700 group"
              >
                <span data-test="get-started-btn">Get Started</span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReviewsPage;