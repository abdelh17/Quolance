"use client";

import { useState } from "react";
import { useProjectContext } from "../../AdminContext/ProjectContext";
import Pagination from "../../componentsAdmin/Pagination";
import ProjectAdminCard from "../../componentsAdmin/ProjectAdminCard";
import { FaBan } from 'react-icons/fa';

export default function AdminApproveProject() {
  const { projects } = useProjectContext();
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 4;

  const pendingProjects = projects.filter((project) => project.status === "pending");
  const totalPages = Math.ceil(pendingProjects.length / projectsPerPage);

  const currentProjects = pendingProjects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  );

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <h1 className="text-center heading-1 m-10"> Update Project Status </h1>
  
      {currentProjects.length > 0 ? (
        <div className="container grid grid-cols-12 gap-6">
          <div className="col-span-12 rounded-xl border border-n30 p-4 sm:p-8 lg:col-span-12">
            <div className="flex flex-col gap-4">
              {currentProjects.map((project) => (
                <ProjectAdminCard
                  key={project.id}
                  id={project.id}
                  name={project.name}
                  tags={project.tags}
                  clientId={project.clientId} 
                  status={project.status}
                />
              ))}
            </div>
  
            <div className="container pt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-center text-lg text-gray-500">No projects pending</div>   
          <FaBan size={250} className="mx-auto mb-4 mt-4" />
        </div>
      )}
    </>
  );
}
