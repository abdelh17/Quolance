'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PiPaperPlaneTilt } from 'react-icons/pi';
import { useGetFreelancerProfile } from '@/api/freelancer-api';
import Loading from '@/components/ui/loading/loading';
import FreelancerDefaultProfilePic from '@/public/images/freelancer_default_icon.png';
import badge from '@/public/images/verify-badge.png';
import { formatEnumString } from '@/util/stringUtils';
import { FaFacebook, FaGithub } from 'react-icons/fa';
import { BsLinkedin, BsTwitter } from 'react-icons/bs';
import { MapPin, Users } from 'lucide-react';
import StarRating from '@/components/ui/StarRating';
import { ProjectExperienceCard } from '@/app/(with-main-layout)/(authenticated-pages)/(freelancer-protect-pages)/profile/components/ProjectExperienceSection';
import { WorkExperienceCard } from '@/app/(with-main-layout)/(authenticated-pages)/(freelancer-protect-pages)/profile/components/WorkExperienceSection';

const tabButton = ['Experiences', 'Projects', 'Recommendations'];

// Only allow 4 platforms to match ContactSection
const SOCIAL_PLATFORMS = [
  {
    name: 'Facebook',
    icon: <FaFacebook className='text-blue-600' />,
    prefix: 'https://facebook.com/',
  },
  {
    name: 'X',
    icon: <BsTwitter className='text-blue-400' />,
    prefix: 'https://twitter.com/',
  },
  {
    name: 'LinkedIn',
    icon: <BsLinkedin className='text-blue-700' />,
    prefix: 'https://linkedin.com/in/',
  },
  {
    name: 'GitHub',
    icon: <FaGithub className='text-gray-800' />,
    prefix: 'https://github.com/',
  },
];

export default function FreelancerPage() {
  const [activeTab, setActiveTab] = useState('Experiences');

  const { username } = useParams();
  const { data: freelancer, isLoading } = useGetFreelancerProfile(
    username as string
  );

  if (isLoading) {
    return <Loading />;
  }

  if (!freelancer) {
    return <div>Freelancer not found</div>;
  }

  // Extract social media links from the freelancer profile
  const socialMediaLinks = freelancer.socialMediaLinks || [];
  const hasSocialLinks =
    socialMediaLinks.length > 0 &&
    socialMediaLinks.some((link) => link.trim() !== '');

  return (
    <>
      <section className='sbp-30 stp-30 bg-stone-100' >
        <div className='container'>
          <div className='grid grid-cols-12 gap-6'>
            <div className='border-n40 col-span-12 rounded-xl border px-6 py-14 lg:col-span-4 bg-white'>
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
                  <a
                    href={`mailto:${
                      freelancer.contactEmail || 'example@domain.com'
                    }`}
                    className='bg-n700 hover:text-n900 relative block w-full overflow-hidden rounded-full px-6 py-3 text-sm font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)]'
                  >
                    <div className='relative z-20 flex items-center justify-center gap-3'>
                      <span className='text-xl !leading-none'>
                        <PiPaperPlaneTilt />
                      </span>
                      <span>Get in touch</span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Location Section */}
              <div className='flex flex-col items-start justify-start gap-3 pt-8'>
                <p className='text-sm font-medium'>Location</p>
                <div className='flex items-center'>
                  <MapPin className='mr-2 text-blue-500' size={18} />
                  <p className='text-gray-700'>
                    {freelancer.city || 'Not Specified'}
                    {freelancer.state && `, ${freelancer.state}`}
                  </p>
                </div>
              </div>

              {/* Experience Level */}
              <div className='flex flex-col items-start justify-start gap-3 pt-8'>
                <p className='text-sm font-medium'>Experience level</p>
                <p className='bg-r50 text-r300 rounded-full px-3 py-[6px] text-[13px]'>
                  {freelancer.experienceLevel
                    ? formatEnumString(freelancer.experienceLevel)
                    : 'Not Specified'}
                </p>
              </div>

              {/* Availability */}
              <div className='flex flex-col items-start justify-start gap-3 pt-8'>
                <p className='text-sm font-medium'>Availability</p>
                <p className='bg-v50 rounded-full px-3 py-[6px] text-[13px]'>
                  {freelancer.availability
                    ? formatEnumString(freelancer.availability)
                    : 'Not Specified'}
                </p>
              </div>

              {/* Skills */}
              <div className='flex flex-col items-start justify-start gap-3 pt-8'>
                <p className='text-sm font-medium'>Skills</p>
                <div className='flex flex-wrap gap-2'>
                  {freelancer.skills?.map((skill, idx) => (
                    <p
                      key={idx}
                      className='bg-b50 rounded-xl px-3 py-[6px] font-medium'
                    >
                      {skill}
                    </p>
                  ))}
                  {freelancer.skills?.length === 0 && (
                    <p className='text-gray-700 text-sm'>Not Specified</p>
                  )}
                </div>
              </div>

              {/* Languages */}
              <div className='flex flex-col items-start justify-start gap-3 pt-8'>
                <p className='text-sm font-medium'>Languages</p>
                <div className='flex flex-wrap gap-2'>
                  {freelancer.languagesSpoken?.map((language, idx) => (
                    <p
                      key={idx}
                      className='bg-g50 rounded-full px-3 py-[6px] font-medium'
                    >
                      {formatEnumString(language)}
                    </p>
                  ))}
                  {freelancer.languagesSpoken?.length === 0 && (
                    <p className='text-gray-700 text-sm'>Not Specified</p>
                  )}
                </div>
              </div>

              {/* Social Media Links - Display only the 4 allowed platforms */}
              <div className='flex flex-col items-start justify-start gap-3 pt-8'>
                <p className='text-sm font-medium'>Social links</p>
                {hasSocialLinks ? (
                  <div className='flex flex-wrap gap-2'>
                    {/* Filter links to only show supported platforms */}
                    {socialMediaLinks.map((link, index) => {
                      // Check if this link belongs to one of our supported platforms
                      const platform = SOCIAL_PLATFORMS.find((p) =>
                        link.includes(p.prefix.replace('https://', ''))
                      );

                      // Only display if it's a supported platform
                      return (
                        link.trim() !== '' &&
                        platform && (
                          <Link
                            key={index}
                            href={link}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='rounded-full bg-gray-100 p-3 font-medium transition-colors duration-200 hover:bg-gray-200'
                            title={platform.name}
                          >
                            {platform.icon}
                          </Link>
                        )
                      );
                    })}
                  </div>
                ) : (
                  <div className='flex items-center'>
                    <Users className='mr-3 text-blue-500' />
                    <span className='text-gray-700 text-sm'>Not Specified</span>
                  </div>
                )}
              </div>
            </div>

            <div className='border-n40 col-span-12 rounded-xl border p-4 sm:p-8 lg:col-span-8 bg-white'>
              <h3 className='heading-3'>About me</h3>
              <p className='text-bg-n300 pt-3 font-medium'>{freelancer.bio}</p>

              <div className='flex flex-col gap-4 pt-10'>
                <ul className='border-n40 text-n100 flex items-center justify-start gap-5 border-b pb-5 max-md:flex-wrap'>
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

                <div className={'mt-3'}>
                  {/* Project Experiences */}
                  {activeTab === 'Projects' &&
                    (freelancer.projectExperiences &&
                    freelancer.projectExperiences.length > 0 ? (
                      freelancer.projectExperiences.map((project, idx) => (
                        <ProjectExperienceCard key={idx} project={project} />
                      ))
                    ) : (
                      <div className='rounded-xl border p-6 text-center'>
                        <p className='text-gray-500'>
                          No project experience to display.
                        </p>
                      </div>
                    ))}

                  {/* Work Experiences */}
                  {activeTab === 'Experiences' &&
                    (freelancer.workExperiences &&
                    freelancer.workExperiences.length > 0 ? (
                      freelancer.workExperiences.map((work, idx) => (
                        <WorkExperienceCard key={idx} experience={work} />
                      ))
                    ) : (
                      <div className='rounded-xl border p-6 text-center'>
                        <p className='text-gray-500'>
                          No work experience to display.
                        </p>
                      </div>
                    ))}

                  {/* Recommendations */}
                  {activeTab === 'Recommendations' && (
                    <>
                      <div className='border-n40 rounded-2xl border p-8'>
                        <div className='flex items-center justify-start gap-3 pb-2'>
                          <div className=''>
                            <div className='flex items-center justify-start gap-3'>
                              <h5 className='heading-5'>John Doe</h5>
                            </div>
                            <p className='text-n500 pt-2'>
                              Project for frontend development
                            </p>
                          </div>
                        </div>
                        <p className='text-n300 pt-3 font-medium'>
                          It was a pleasure working with Alice. She was super
                          clear and detailed with the project requirements. I
                          appreciate her wonderful communication, collaboration,
                          and flexibility. Thanks, Alice!
                        </p>

                        {/* 5-Star Rating */}
                        <div className='flex items-center justify-start gap-2 pt-5'>
                          <StarRating rating={4.5} />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
