import ProjectApplication from '@/app/(with-main-layout)/projects/[id]/ProjectApplication';
import ProjectCard from '@/components/ui/projects/ProjectCard';
import React from 'react';

// Mock data for top projects
const topProjects = [
  {
    tags: ["Finance", "Tech"],
    projectId: 1,
    createdAt: '10/10/2024',
    projectCategory: 'Finance',
    projectTitle: 'Financial Dashboard Development',
    projectDescription: 'Develop a comprehensive financial dashboard for a fintech company.',
    priceRange: '$10,000 - $15,000',
    experienceLevel: 'Expert',
    expectedDeliveryTime: '120 Hours',
    deliveryDate: '12/12/2024',
    location: 'New York, USA',
    projectStatus: 'APPROVED',
    clientId: 101,
  },
  {
    tags: ["Healthcare", "Data Science"],
    projectId: 2,
    createdAt: '09/05/2024',
    projectCategory: 'Healthcare',
    projectTitle: 'Patient Data Analytics',
    projectDescription: 'Analyze patient data for trends in healthcare outcomes.',
    priceRange: '$8,000 - $12,000',
    experienceLevel: 'Advanced',
    expectedDeliveryTime: '80 Hours',
    deliveryDate: '11/15/2024',
    location: 'Toronto, Canada',
    projectStatus: 'APPROVED',
    clientId: 102,
  },
  {
    tags: ["Marketing", "Content"],
    projectId: 3,
    createdAt: '07/25/2024',
    projectCategory: 'Marketing',
    projectTitle: 'Social Media Content Strategy',
    projectDescription: 'Create a content strategy for increasing social media engagement.',
    priceRange: '$5,000 - $8,000',
    experienceLevel: 'Intermediate',
    expectedDeliveryTime: '60 Hours',
    deliveryDate: '11/20/2024',
    location: 'London, UK',
    projectStatus: 'APPROVED',
    clientId: 103,
  },
];

function FindClientsPage() {
  return (
    <div className="flex justify-center p-8">
      <div className="w-[100%] max-w-3xl">
        <h2 className="heading-2 mb-2"> Interesting Projects Near You</h2>
        <p className="mb-4 text-gray-600">
          Discover high-quality projects that match your skills and interests.
        </p>

        {/* Scrollable project list */}
        <div className="h-[400px] overflow-y-scroll scrollbar-thin scrollbar-thumb-blue-600 space-y-4">
          {topProjects.map((project, index) => (
            <div 
              key={index} 
              className="p-4 "
            >
              <ProjectCard
                tags={project.tags}
                projectId={project.projectId}
                createdAt={project.createdAt}
                projectCategory={project.projectCategory}
                projectTitle={project.projectTitle}
                projectDescription={project.projectDescription}
                priceRange={project.priceRange}
                experienceLevel={project.experienceLevel}
                expectedDeliveryTime={project.expectedDeliveryTime}
                deliveryDate={project.deliveryDate}
                location={project.location}
                projectStatus={project.projectStatus}
                clientId={project.clientId}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FindClientsPage;
