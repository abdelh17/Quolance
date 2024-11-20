"use client";
import FreelancerCard from '@/components/ui/freelancers/FreelancerCard';
import React from 'react';
import { ApplicationResponse, ApplicationStatus } from '@/constants/models/applications/ApplicationResponse';
import { useQueryClient } from '@tanstack/react-query';
import image1 from '@/public/images/freelancer-hero-img-1.jpg';
import Image from 'next/image';

// Mock data for top freelancers
const topFreelancers = [
    {
      img: '/images/freelancer1.jpg',
      freelancerName: 'Jane Doe',
      location: 'New York, USA',
      status: ApplicationStatus.PENDING_CONFIRMATION,
      isApproveDisabled: false,
    },
    {
      img: '/images/freelancer2.jpg',
      freelancerName: 'John Smith',
      location: 'London, UK',
      status: ApplicationStatus.PENDING_CONFIRMATION,
      isApproveDisabled: true,
    },
    {
      img: '/images/freelancer3.jpg',
      freelancerName: 'Sara Khan',
      location: 'Toronto, Canada',
      status: ApplicationStatus.PENDING_CONFIRMATION,
      isApproveDisabled: true,
    },
    {
        img: '/images/freelancer1.jpg',
        freelancerName: 'Jane Doe',
        location: 'New York, USA',
        status: ApplicationStatus.PENDING_CONFIRMATION,
        isApproveDisabled: false,
      },
      {
        img: '/images/freelancer2.jpg',
        freelancerName: 'John Smith',
        location: 'London, UK',
        status: ApplicationStatus.PENDING_CONFIRMATION,
        isApproveDisabled: false,
      },
      {
        img: '/images/freelancer3.jpg',
        freelancerName: 'Sara Khan',
        location: 'Toronto, Canada',
        status: ApplicationStatus.PENDING_CONFIRMATION,
        isApproveDisabled: false,
      },
    // Add more freelancers as needed
  ];
  
  // Sample handler functions
  const handleApproveSubmission = () => {
    // Approve submission logic
  };
  
  const handleRefuseSelected = async () => {
    // Refuse submission logic
  };
  
  function FindAFreelancerPage() {
    return (
      <div className="bg-gray-800 dark:bg-gray-950 py-10">
      <div className="max-w-[1400px] mx-auto relative p-10 lg:p-16">
        {/* Layout Container */}
        <div className="relative z-10 flex flex-col lg:flex-row items-start gap-8">
            {/* Image Column */}
            <div className="relative w-[1200px] lg:w-[500px] xl:w-[600px] -mb-10 lg:mb-0 lg:-ml-16">
              <Image
                className="shadow-xl shadow-gray-600 rounded-xl dark:shadow-gray-900/20 object-cover h-[1000px] -mt-100"
                src={image1}
                alt="Features Image"
                width={1000}
                height={1200}
                priority
              />
            </div>
  
            {/* Freelancers Column */}
            <div className="flex-grow bg-gray-100 dark:bg-neutral-800 p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold sm:text-3xl text-gray-800 dark:text-neutral-200">
              Top Freelancers for You
            </h2>
            <p className="mt-4 text-gray-600 dark:text-neutral-400">
              Here are some top-rated freelancers ready to work with you.
            </p>

            <div className="grid mt-6 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
              {topFreelancers.slice(0, 4).map((freelancer, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-6 rounded-lg shadow-lg dark:bg-neutral-800"
                >
                  <FreelancerCard
                    img={freelancer.img}
                    freelancerName={freelancer.freelancerName}
                    handleApproveSubmission={handleApproveSubmission}
                    location={freelancer.location}
                    onSelect={handleRefuseSelected}
                    status={freelancer.status}
                    isApproveDisabled={freelancer.isApproveDisabled}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Background Layer */}
        <div className="absolute inset-0 grid grid-cols-12 pointer-events-none">
          <div className="col-span-full lg:col-span-8 lg:col-start-5 bg-gray-100 w-full h-full rounded-xl dark:bg-neutral-800"></div>
        </div>
      </div>
    </div>
    );
  }
  
  export default FindAFreelancerPage;