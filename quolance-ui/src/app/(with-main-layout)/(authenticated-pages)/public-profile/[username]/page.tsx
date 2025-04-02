'use client';

import { useEffect, useState } from 'react';
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
import { Mail } from 'lucide-react';
import { ProjectExperienceCard } from '@/app/(with-main-layout)/(authenticated-pages)/(freelancer-protect-pages)/profile/components/ProjectExperienceSection';
import { WorkExperienceCard } from '@/app/(with-main-layout)/(authenticated-pages)/(freelancer-protect-pages)/profile/components/WorkExperienceSection';
import ReviewCard from '../../(freelancer-protect-pages)/profile/components/ReviewCard';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { useChat } from '@/components/ui/chat/ChatProvider';

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
  const { onNewChat } = useChat();

  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 768;
      if (!tabButton.includes(activeTab) && isDesktop) {
        setActiveTab('Experiences');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab]);

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
      <section className='sbp-30 stp-30 bg-stone-100'>
        <div className='container'>
          <div className='grid grid-cols-12 gap-6'>
            <div className='border-n40 col-span-12 rounded-xl border border bg-white px-6 py-14 lg:col-span-4'>
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

                <div className='flex w-full flex-col items-center justify-center gap-1 pt-10'>
                  <h4 className='heading-4 max-w-full  break-all'>
                    {freelancer.firstName}
                  </h4>
                  <h4 className='heading-4 max-w-full  break-all'>
                    {freelancer.lastName}
                  </h4>
                </div>

                <div className='w-full pt-6 sm:px-12'>
                  <button
                    onClick={() =>
                      onNewChat(
                        freelancer.userId,
                        `${freelancer.firstName} ${freelancer.lastName}`,
                        freelancer.profileImageUrl || ''
                      )
                    }
                    className='bg-n700 hover:text-n900 relative block w-full overflow-hidden rounded-full px-6 py-3 text-sm font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)]'
                  >
                    <div className='relative z-20 flex items-center justify-center gap-3 whitespace-nowrap'>
                      <span className='text-xl !leading-none'>
                        <PiPaperPlaneTilt />
                      </span>
                      <span>Get in touch</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Location Section */}
              <div className='flex w-full flex-col items-start justify-start gap-3 pt-8'>
                <p className='text-sm font-medium'>Location</p>
                <div className='flex w-full items-start'>
                  {freelancer.city || freelancer.state ? (
                    <p className='text-md w-full break-words text-gray-700'>
                      {(freelancer.city || '') +
                        (freelancer.state ? `, ${freelancer.state}` : '')}
                    </p>
                  ) : (
                    <p className='text-sm italic text-gray-500'>
                      Not Specified
                    </p>
                  )}
                </div>
              </div>

              {/* Email Section */}
              <div className='flex w-full flex-col items-start justify-start gap-3 pt-8'>
                <p className='text-sm font-medium'>Email</p>

                {freelancer.contactEmail ? (
                  <a
                    href={`mailto:${freelancer.contactEmail}`}
                    className='mr-3 rounded-full bg-gray-100 p-3 font-medium transition-colors duration-200 hover:bg-gray-200'
                  >
                    <Mail className='text-b300 h-4 w-4' />
                  </a>
                ) : (
                  <p className='text-sm italic text-gray-500'>Not specified</p>
                )}
              </div>

              {/* Experience Level */}
              <div className='flex flex-col items-start justify-start gap-3 pt-8'>
                <p className='text-sm font-medium'>Experience level</p>
                {freelancer.experienceLevel ? (
                  <p className='bg-r50 text-r300 rounded-full px-3 py-[6px] text-[13px]'>
                    {formatEnumString(freelancer.experienceLevel)}
                  </p>
                ) : (
                  <p className='text-sm italic text-gray-500'>Not Specified</p>
                )}
              </div>

              {/* Availability */}
              <div className='flex flex-col items-start justify-start gap-3 pt-8'>
                <p className='text-sm font-medium'>Availability</p>
                {freelancer.availability ? (
                  <p className='bg-v50 rounded-full px-3 py-[6px] text-[13px]'>
                    {formatEnumString(freelancer.availability)}
                  </p>
                ) : (
                  <p className='text-sm italic text-gray-500'>Not Specified</p>
                )}
              </div>

              {/* Skills */}
              <div className='flex flex-col items-start justify-start gap-3 pt-8'>
                <p className='text-sm font-medium'>Skills</p>
                <div className='flex flex-wrap  gap-2'>
                  {freelancer.skills?.map((skill, idx) => (
                    <p
                      key={idx}
                      className={`
                     bg-b50 
                     inline-flex
                     h-10 w-28 items-center
                     justify-center truncate rounded-full
                     text-center text-xs font-medium text-gray-700
                   `}
                    >
                      {skill}
                    </p>
                  ))}
                  {freelancer.skills?.length === 0 && (
                    <p className='text-sm italic text-gray-500'>
                      Not Specified
                    </p>
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
                      className={`
                       bg-g50
                       inline-flex
                       h-10 w-28 items-center
                       justify-center truncate rounded-full
                       text-center text-xs font-medium text-gray-700
                     `}
                    >
                      {formatEnumString(language)}
                    </p>
                  ))}
                  {freelancer.languagesSpoken?.length === 0 && (
                    <p className='text-sm italic text-gray-500'>
                      Not Specified
                    </p>
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
                    <span className='text-sm italic text-gray-500'>
                      Not Specified
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className='border-n40  col-span-12 rounded-xl border bg-white p-4 sm:p-8 lg:col-span-8'>
              <h3 className='heading-3'>About me</h3>
              <p className='text-bg-n300 pt-3 text-justify text-sm font-medium sm:text-base '>
                {freelancer.bio}
              </p>

              <div className='flex flex-col gap-4 pt-10'>
                <ul className='border-n40 hidden border-b md:flex'>
                  {tabButton.map((item, idx) => (
                    <li
                      key={idx}
                      onClick={() => setActiveTab(item)}
                      className={`cursor-pointer border-b-2 px-4 py-2 text-sm font-medium transition-all duration-300 ${
                        activeTab === item
                          ? 'border-n900 text-n900'
                          : 'text-n500 hover:text-n900 border-transparent '
                      }`}
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Accordions on small screens */}
                <div className='flex flex-col gap-2 md:hidden'>
                  {tabButton.map((item, idx) => (
                    <div key={idx} className='rounded-lg border'>
                      <button
                        onClick={() =>
                          setActiveTab(activeTab === item ? '' : item)
                        }
                        className='flex w-full items-center justify-between px-4 py-3 text-left font-semibold'
                      >
                        {item}
                        <span className='text-xl text-gray-500'>
                          {activeTab === item ? (
                            <IoChevronUp />
                          ) : (
                            <IoChevronDown />
                          )}
                        </span>
                      </button>
                      {activeTab === item && (
                        <div className='p-4'>
                          {item === 'Projects' &&
                            (freelancer.projectExperiences?.length > 0 ? (
                              freelancer.projectExperiences.map(
                                (project, idx) => (
                                  <ProjectExperienceCard
                                    key={idx}
                                    project={project}
                                  />
                                )
                              )
                            ) : (
                              <p className='text-sm text-gray-500'>
                                No project experience to display.
                              </p>
                            ))}

                          {item === 'Experiences' &&
                            (freelancer.workExperiences?.length > 0 ? (
                              freelancer.workExperiences.map((work, idx) => (
                                <WorkExperienceCard
                                  key={idx}
                                  experience={work}
                                />
                              ))
                            ) : (
                              <p className='text-sm text-gray-500'>
                                No work experience to display.
                              </p>
                            ))}

                          {item === 'Recommendations' &&
                            (freelancer.reviews?.length > 0 ? (
                              freelancer.reviews.map((review, idx) => (
                                <ReviewCard
                                  key={idx}
                                  firstName={review.clientFirstName}
                                  lastName={review.clientLastName}
                                  username={review.clientUsername}
                                  title={review.title}
                                  comment={review.comment}
                                  overallRating={review.overallRating}
                                  communicationRating={
                                    review.communicationRating
                                  }
                                  qualityOfDeliveryRating={
                                    review.qualityOfDeliveryRating
                                  }
                                  qualityOfWorkRating={
                                    review.qualityOfWorkRating
                                  }
                                />
                              ))
                            ) : (
                              <p className='text-sm text-gray-500'>
                                No reviews to display.
                              </p>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Only show on medium+ screens */}
                <div className='mt-3 hidden md:block'>
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

                  {activeTab === 'Recommendations' &&
                    (freelancer.reviews && freelancer.reviews.length > 0 ? (
                      freelancer.reviews.map((review, idx) => (
                        <ReviewCard
                          key={idx}
                          firstName={review.clientFirstName}
                          lastName={review.clientLastName}
                          username={review.clientUsername}
                          title={review.title}
                          comment={review.comment}
                          overallRating={review.overallRating}
                          communicationRating={review.communicationRating}
                          qualityOfDeliveryRating={
                            review.qualityOfDeliveryRating
                          }
                          qualityOfWorkRating={review.qualityOfWorkRating}
                        />
                      ))
                    ) : (
                      <div className='rounded-xl border p-6 text-center'>
                        <p className='text-gray-500'>No reviews to display.</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
