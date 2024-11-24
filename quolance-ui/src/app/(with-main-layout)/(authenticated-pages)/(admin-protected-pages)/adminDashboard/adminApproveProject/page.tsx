"use client";


import { useState } from "react";
import { useProjectContext } from "../../AdminContext/ProjectContext";
import Pagination from "../../componentsAdmin/Pagination";
import ProjectAdminCard from "../../componentsAdmin/ProjectAdminCard";
import { FaBan } from 'react-icons/fa';


export default function AdminApproveProject() {
 const { projects } = useProjectContext();
 const [currentPage, setCurrentPage] = useState(1);
 const projectsPerPage = 5;


 const pendingProjects = projects.filter((project) => project.projectStatus === "pending");
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
     <h1 className="text-center font-medium text-3xl m-10">
       Update Project Status
     </h1>
      {currentProjects.length > 0 ? (
       <div className="container grid grid-cols-12 gap-6 mb-4">
         <div
           className="col-span-12 rounded-xl border border-gray-300 p-4 sm:p-8 lg:col-span-12 flex flex-col justify-between"
           style={{ minHeight: "650px" }}
         >
           {/* Project Cards */}
           <div className="flex flex-col gap-4">
             {currentProjects.map((project, index) => (
               <ProjectAdminCard
                 key={project.id || index}
                 id={project.id}
                 title={project.title}
                 projectStatus={project.projectStatus}
                 expirationDate={project.expirationDate}
                 clientId={project.clientId}
               />
             ))}
           </div>
            {/* Pagination */}
           <div className="pt-8">
             <Pagination
               currentPage={currentPage}
               totalPages={totalPages}
               onPageChange={handlePageChange}
             />
           </div>
         </div>
       </div>
     ) : (
       <div
         className="flex flex-col items-center justify-center"
         style={{ minHeight: "500px" }}
       >
         <div className="text-center text-lg text-gray-500">
           No projects pending
         </div>
         <FaBan size={75} className="mx-auto mb-4 mt-4" />
       </div>
     )}
   </>
 );
}
