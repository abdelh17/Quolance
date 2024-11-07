'use client';
import {
  PiCaretLeft,
  PiCaretRight,
  PiHeart,
  PiPaperPlaneTilt,
} from 'react-icons/pi';
import { FreeMode, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import 'swiper/css';

function FreelancerCard({
  img,
  freelancerName,
  location,
}: {
  img: string;
  freelancerName: string;
  location: string;
}) {
  return (
    <div className='border-n40 bg-n10 flex min-w-[414px] max-w-[414px] flex-col gap-6 rounded-3xl border py-6 '>
      <div className='flex items-center justify-start gap-3 px-3 sm:px-6'>
        <div className='relative max-md:overflow-hidden'>
          <div className='hexagon-styles bg-b50 my-[calc(100px*0.5/2)] h-[calc(100px*0.57736720554273)] w-[100px] rounded-[calc(100px/36.75)] before:rounded-[calc(100px/18.75)] after:rounded-[calc(100px/18.75)]'>
            <div className='absolute -top-[20px] left-[5px]'>
              <div className='hexagon-styles bg-b300 z-10 my-[calc(90px*0.5/2)] h-[calc(90px*0.57736720554273)] w-[90px] rounded-[calc(90px/50)] before:rounded-[calc(90px/50)] after:rounded-[calc(90px/50)]'>
                <div className='absolute -top-[19px] left-[4px] z-20'>
                  <div className='hexagon-styles bg-b50 z-10 my-[calc(82px*0.5/2)] h-[calc(82px*0.57736720554273)] w-[82px] rounded-[calc(82px/50)] before:rounded-[calc(82px/50)] after:rounded-[calc(82px/50)]'>
                    <div className='r-hex3 absolute -left-0.5 -top-[19px] z-30 inline-block w-[86px] overflow-hidden'>
                      <div className='r-hex-inner3'>
                        <div
                          className={`${img} r-hex-inner-3 before:h-[86px] before:bg-cover`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='absolute bottom-3 right-1 z-30'>
            <div className={'an-image-used-to-be-here bg-gray-300'} />
          </div>
        </div>
        <div className='max-[350px]:max-w-20'>
          <div className='flex items-center justify-start gap-3'>
            <h5 className='heading-5'>{freelancerName}</h5>
            <p className='bg-y300 rounded-full px-2 py-1 text-xs font-medium'>
              PRO
            </p>
          </div>
          <p className='text-n500 pt-2'>{location}</p>
        </div>
      </div>

      <div className='flex flex-wrap gap-2 px-6 text-[13px]'>
        <p className='bg-r50 text-r300 rounded-full px-2 py-1 font-medium'>
          $75 - $100/hr
        </p>
        <p className='bg-g50 text-g400 rounded-full px-2 py-1 font-medium'>
          TOP INDEPENDENT
        </p>
        <p className='bg-v50 text-v300 rounded-full px-2 py-1 font-medium'>
          AVAILABLE
        </p>
      </div>

      <div className='text-n400 flex flex-wrap gap-2 px-6'>
        <div className='bg-b50 flex items-center justify-center gap-2 rounded-xl px-3 py-2 font-medium'>
          <div className={'bg-gray-300'} />
          <span>Handyman</span>
        </div>
        <div className='bg-b50 flex items-center justify-center gap-2 rounded-xl px-3 py-2 font-medium'>
          <div className={'bg-gray-300'} />
          <span>Plumber </span>
        </div>
        <p className='bg-b50 rounded-xl px-3 py-2 font-medium'>+3</p>
      </div>

      <div className='relative'>
        <Swiper
          loop={true}
          slidesPerView={'auto'}
          spaceBetween={12}
          navigation={{
            nextEl: '.ara-next',
            prevEl: '.ara-prev',
          }}
          modules={[FreeMode, Navigation]}
          className='swiper expert-slider-carousel group'
        >
          {[0, 1, 2, 3].map((item, i) => (
            <SwiperSlide className='swiper-wrapper' key={i}>
              <div className={'bg-gray-300'}></div>
            </SwiperSlide>
          ))}
          <div className='absolute left-2 right-2 top-28 z-10'>
            <div className='flex w-full items-center justify-between'>
              <button className='ara-prev border-r300 text-r300 hover:bg-r300 flex -translate-x-12 items-center justify-center rounded-full border-2 p-2 text-lg !leading-none opacity-0 duration-500 hover:text-white group-hover:translate-x-0 group-hover:opacity-100'>
                <PiCaretLeft />
              </button>
              <button className='ara-next border-r300 text-r300 hover:bg-r300 flex translate-x-12 items-center justify-center rounded-full border-2 p-2 text-lg !leading-none opacity-0 duration-500 hover:text-white group-hover:translate-x-0 group-hover:opacity-100'>
                <PiCaretRight />
              </button>
            </div>
          </div>
        </Swiper>
      </div>

      <div className='flex items-center justify-start gap-2 px-6'>
        <Link
          href={`/freelancers/${1}`}
          className='bg-n700 hover:text-n900 relative w-full overflow-hidden rounded-full px-6 py-3 text-sm font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)]'
        >
          <div className='relative z-20 flex items-center justify-center gap-3'>
            <PiPaperPlaneTilt className='text-xl !leading-none' />
            <span>Get in touch</span>
          </div>
        </Link>
        <button className='hover:bg-y300 relative flex items-center justify-center rounded-full border p-3 text-xl !leading-none duration-500'>
          <PiHeart />
        </button>
      </div>
    </div>
  );
}

export default FreelancerCard;
