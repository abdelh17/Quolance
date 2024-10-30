'use client';
// Import Swiper React components
import Image from 'next/image';
import { Autoplay, FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';

import sliderImg1 from '@/public/images/freelancer-hero-img-1.jpg';
import sliderImg2 from '@/public/images/freelancer-hero-img-2.jpg';

import FadeDown from '../animation/FadeDown';
import FadeRight from '../animation/FadeRight';
import FadeTop from '../animation/FadeTop';

const sliderImages = [sliderImg1, sliderImg2];

function HeroSection() {
  return (
    <section className='pt-[100px]'>
      <div className='bg relative z-10 h-[650px] sm:h-[600px] md:h-[700px] lg:h-[800px]'>
        <div className='bg-n900/80 absolute inset-0 z-20'></div>
        <Swiper
          modules={[FreeMode, Autoplay]}
          loop={true}
          direction="vertical"
          slidesPerView={4}
          speed={10000}
          autoplay={{
            delay: 1,
          }}
          breakpoints={{
            0: {
              slidesPerView: 13,
              spaceBetween: 10,
            },
            350: {
              slidesPerView: 11,
              spaceBetween: 10,
            },

            400: {
              slidesPerView: 9,
              spaceBetween: 10,
            },
            500: {
              slidesPerView: 8,
              spaceBetween: 10,
            },
            620: {
              slidesPerView: 7,
              spaceBetween: 10,
            },

            880: {
              slidesPerView: 6,
              spaceBetween: 10,
            },
            1150: {
              slidesPerView: 5,
              spaceBetween: 24,
              centeredSlides: true,
            },
            1500: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
          }}
          className='smooth !absolute !inset-0 mx-auto w-fit'
        >
          {sliderImages.map((item, idx) => (
            <SwiperSlide className='swiper-slide' key={idx}>
              <Image src={item} alt='' />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className='max-xxl:overflow-hidden relative z-30 mx-auto flex h-full max-w-[950px] flex-col items-center justify-center text-center text-white'>
          <FadeDown>
            <h5 className='heading-5 pb-3 text-center'>Quolance</h5>
          </FadeDown>
          <FadeRight>
            <h1 className='display-2 pb-6 font-extrabold'>
              Find the Right <br />
              <span className='text-y300'>Talent</span> for Any Task
            </h1>
          </FadeRight>
          <FadeTop>
            <p className='w-[95%] pb-10 text-xl sm:text-2xl'>
              Access assistance from a vast network of reliable local experts,
              spanning programming, design, writing, and more.
            </p>
          </FadeTop>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
