'use client';

import React from 'react';
import { StarIcon } from '@heroicons/react/20/solid';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
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
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-12 sm:py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Client Success Stories
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Discover how Quolance has helped businesses and freelancers achieve their goals. 
              Our platform has enabled countless successful collaborations and projects.
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-b300">Testimonials</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Trusted by Businesses Worldwide
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Read what our clients say about their experience with Quolance
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
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
              pagination={{ clickable: true }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              className="pb-12"
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
                <SwiperSlide key={review.id}>
                  <div className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
                    <div className="flex items-center gap-x-4 mb-4">
                      <img src={review.image} alt="" className="h-12 w-12 rounded-full bg-gray-100" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{review.name}</h3>
                        <p className="text-sm text-gray-500">{review.role}</p>
                      </div>
                    </div>
                    <div className="flex gap-x-1 mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 italic">{review.comment}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:flex lg:items-center lg:justify-between lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Ready to experience the difference?<br />
            Join our growing community today.
          </h2>
          <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
            <a
              href="/auth/register"
              className="bg-b300 hover:text-n900 relative flex items-center justify-center  rounded-full px-8 py-3 font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)]"
            >
              <span className="relative z-10">Get Started</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;