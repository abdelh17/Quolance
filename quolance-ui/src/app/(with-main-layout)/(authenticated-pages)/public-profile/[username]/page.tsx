'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PiCaretRight, PiPaperPlaneTilt, PiStarFill } from 'react-icons/pi';
import { useGetFreelancerProfile } from '@/api/freelancer-api';
import Loading from '@/components/ui/loading/loading';
import FreelancerDefaultProfilePic from '@/public/images/freelancer_default_icon.png';
import badge from '@/public/images/verify-badge.png';
import { formatEnumString } from '@/util/stringUtils';
import { 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaInstagram, 
  FaYoutube, 
  FaGithub, 
  FaTiktok,
  FaGlobe
} from 'react-icons/fa';
import { BsTwitter, BsLinkedin, BsInstagram } from 'react-icons/bs';

const tabButton = ['Services', 'Works', 'Jobs', 'Recommendations'];

// Social media platform configurations
const SOCIAL_PLATFORMS = [
  { name: "Facebook", icon: <FaFacebook className="text-blue-600" />, prefix: "https://facebook.com/" },
  { name: "Twitter/X", icon: <BsTwitter className="text-blue-400" />, prefix: "https://twitter.com/" },
  { name: "LinkedIn", icon: <BsLinkedin className="text-blue-700" />, prefix: "https://linkedin.com/in/" },
  { name: "Instagram", icon: <BsInstagram className="text-pink-600" />, prefix: "https://instagram.com/" },
  { name: "YouTube", icon: <FaYoutube className="text-red-600" />, prefix: "https://youtube.com/" },
  { name: "GitHub", icon: <FaGithub className="text-gray-800" />, prefix: "https://github.com/" },
  { name: "TikTok", icon: <FaTiktok className="text-black" />, prefix: "https://tiktok.com/@" },
  { name: "Website", icon: <FaGlobe className="text-blue-500" />, prefix: "https://" }
];

// Function to get the appropriate icon for a URL
const getSocialMediaIcon = (url : string) => {
  const platform = SOCIAL_PLATFORMS.find(p => url.includes(p.prefix.replace("https://", "")));
  return platform ? platform.icon : <FaGlobe className="text-blue-500" />; // Default to globe icon
};

export default function FreelancerPage() {
  const [activeTab, setActiveTab] = useState('Services');
  
  const { username } = useParams();
  const { data: freelancer, isLoading } = useGetFreelancerProfile(
    username as string
  );

  console.log(freelancer);

  if (isLoading) {
    return <Loading />;
  }

  if (!freelancer) {
    return <div>Freelancer not found</div>;
  }

  // Extract social media links from the freelancer profile
  const socialMediaLinks = freelancer.socialMediaLinks || [];
  const hasSocialLinks = socialMediaLinks.length > 0 && socialMediaLinks.some(link => link.trim() !== "");

  return (
    <>
      <section className='sbp-30 stp-30'>
        <div className='container'>
          <div className='grid grid-cols-12 gap-6'>
            <div className='border-n30 col-span-12 rounded-xl border px-6 py-14 lg:col-span-4'>
              <div className='flex flex-col items-center justify-center'>
                <div className='relative max-w-[180px] max-md:overflow-hidden'>
                  <Image
                    alt={`${freelancer.firstName} ${freelancer.lastName}'s profile`}
                    src={
                      freelancer.profileImageUrl || FreelancerDefaultProfilePic
                    }
                    width={180}
                    height={180}
                    className={`aspect-square rounded-full object-cover ring-4 ring-blue-400 ring-offset-[5px]`}
                    priority
                  />
                  <div className='absolute bottom-5 right-[-0.3rem] z-30'>
                    {/*
                      Profile badge? Might delete... (verified icon)
                      An idea: We can use the verified icon when the freelancer completes their profile
                    */}
                    <Image
                      src={badge}
                      alt='Profile badge'
                      width={36}
                      height={36}
                      className=''
                    />
                  </div>
                </div>

                <div className='flex items-center justify-center gap-3 pt-10'>
                  <h4 className='heading-4'>
                    {freelancer.firstName + ' ' + freelancer.lastName}
                  </h4>
                </div>
                <div className='w-full pt-6 sm:px-12'>
                  <Link
                    href='/chat'
                    className='bg-n700 hover:text-n900 relative block w-full overflow-hidden rounded-full px-6 py-3 text-sm font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)]'
                  >
                    <div className='relative z-20 flex items-center justify-center gap-3'>
                      <span className='text-xl !leading-none'>
                        <PiPaperPlaneTilt />
                      </span>
                      <span>Get in touch</span>
                    </div>
                  </Link>
                </div>

                {/* View Portfolio */}
                <Link
                  href='/worker-portfolio'
                  className='border-n30 mt-7 flex w-full items-center justify-between rounded-xl border px-5 py-4'
                >
                  <p className='font-semibold'>View My Portfolio</p>
                  <span className='text-xl !leading-none'>
                    <PiCaretRight />
                  </span>
                </Link>
                
              </div>

              {/* Experience Level */}
              <div className='flex flex-col items-start justify-start gap-3 pt-8'>
                <p className='text-sm font-medium'>EXPERIENCE LEVEL</p>
                <p className='bg-r50 text-r300 rounded-full px-3 py-1 text-[13px]'>
                  {freelancer.experienceLevel
                    ? formatEnumString(freelancer.experienceLevel)
                    : 'Not Specified'}
                </p>
              </div>
              {/* Skills */}
              <div className='flex flex-col items-start justify-start gap-3 pt-8'>
                <p className='text-sm font-medium'>SKILLS</p>
                <div className='flex flex-wrap gap-2'>
                  {freelancer.skills?.map((skill, idx) => (
                    <p
                      key={idx}
                      className='bg-b50 rounded-xl px-3 py-2 font-medium'
                    >
                      {skill}
                    </p>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className='flex flex-col items-start justify-start gap-3 pt-8'>
                <p className='text-sm font-medium'>AVAILABILITY</p>
                <p className='bg-v50 rounded-full px-3 py-1 text-[13px]'>
                  {freelancer.availability
                    ? formatEnumString(freelancer.availability)
                    : 'Not Specified'}
                </p>
              </div>

              {/* About (bio) */}
              <div className='flex flex-col items-start justify-start gap-3 pt-8'>
                <p className='text-sm font-medium'>ABOUT</p>
                <p className='text-n300'>{freelancer.bio}</p>
              </div>

              {/* Social Media Links - Now Dynamic */}
              <div className='flex flex-col items-start justify-start gap-3 pt-8'>
                <p className='text-sm font-medium'>LINKS</p>
                {hasSocialLinks ? (
                  <div className='flex flex-wrap gap-2'>
                    {socialMediaLinks.map((link, index) => (
                      link.trim() !== "" && (
                        <Link
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className='rounded-full bg-gray-100 p-3 font-medium hover:bg-gray-200 transition-colors duration-200'
                          title={link}
                        >
                          {getSocialMediaIcon(link)}
                        </Link>
                      )
                    ))}
                  </div>
                ) : (
                  <p className='text-gray-500 italic'>No social links provided</p>
                )}
              </div>
            </div>

            <div className='border-n30 col-span-12 rounded-xl border p-4 sm:p-8 lg:col-span-8'>
              <h3 className='heading-3'>Add heading for tab: {activeTab}</h3>
              <p className='text-bg-n300 pt-3 font-medium'>
                Add subtext for tab: {activeTab}
              </p>

              <div className='flex flex-col gap-4 pt-10'>
                <ul className='border-n30 text-n100 flex items-center justify-start gap-5 border-b pb-5 max-md:flex-wrap'>
                  {tabButton.map((item, idx) => (
                    <li
                      onClick={() => setActiveTab(item)}
                      className={`heading-5 cursor-pointer ${
                        activeTab === item ? 'text-n900' : ''
                      } hover:text-n900 duration-500`}
                      key={idx}
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Tab content containers */}
                {activeTab === 'Services' && (
                  <div className='flex flex-col gap-5'>
                    {/* List of services */}
                  </div>
                )}

                {activeTab === 'Works' && (
                  <div className='flex flex-col gap-4 pt-8'>
                    {/* List of works */}
                  </div>
                )}

                {activeTab === 'Jobs' && (
                  <div className='flex flex-col gap-4 pt-8'>
                    {/* List of jobs */}
                  </div>
                )}

                {activeTab === 'Recommendations' && (
                  <div className='flex flex-col gap-4 pt-8'>
                    {/* List of recommendations */}
                    <span>
                      It was a pleasure working with Albert. He is very
                      professional
                    </span>
                    <span>
                      Albert is very professional and his work is top-notch
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}