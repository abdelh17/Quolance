"use client";
import FreelancerCard from '@/components/ui/freelancers/FreelancerCard';
import React from 'react';
import { ApplicationResponse, ApplicationStatus } from '@/constants/models/applications/ApplicationResponse';
import { useQueryClient } from '@tanstack/react-query';

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
        isApproveDisabled: true,
      },
      {
        img: '/images/freelancer3.jpg',
        freelancerName: 'Sara Khan',
        location: 'Toronto, Canada',
        status: ApplicationStatus.PENDING_CONFIRMATION,
        isApproveDisabled: true,
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
      <div className="flex justify-center p-8">
        <div className="w-[80%]">
          <h2 className="heading-2 mb-2">Top Freelancers for You</h2>
          <p className="mb-4 text-gray-600">
            Here are some top-rated freelancers ready to work with you.
          </p>
          
          {/* Scrollable freelancer list */}
          <div className="h-[400px] overflow-y-scroll freelancers-grid scrollbar-thin scrollbar-thumb-blue-600">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {topFreelancers.map((freelancer, index) => (
                <FreelancerCard
                  key={index}
                  img={freelancer.img}
                  freelancerName={freelancer.freelancerName}
                  handleApproveSubmission={handleApproveSubmission}
                  location={freelancer.location}
                  onSelect={handleRefuseSelected}
                  status={freelancer.status}
                  isApproveDisabled={freelancer.isApproveDisabled}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
export default FindAFreelancerPage;