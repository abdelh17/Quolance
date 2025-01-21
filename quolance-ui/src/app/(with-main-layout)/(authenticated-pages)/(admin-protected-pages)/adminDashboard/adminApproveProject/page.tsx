"use client";


import { useProjectContext } from "../../AdminContext/ProjectContext";
import Pagination from "../../componentsAdmin/Pagination";
import ProjectAdminCard from "../../componentsAdmin/ProjectAdminCard";
import { FaBan } from "react-icons/fa";


export default function AdminApproveProject() {
 const {
   projects,
   totalPages,
   currentPage,
   fetchProjects,
 } = useProjectContext();


 const pageSize = 5;


 const handlePageChange = (pageNumber: number) => {
   if (pageNumber >= 1 && pageNumber <= totalPages) {
    
     // The -1 is to start page 0 at number 0.
     // This is because pagination in backend starts at page 0.
     fetchProjects(pageNumber - 1, pageSize);
   }
 };


 return (
   <>
     <h1 className="text-center font-medium text-3xl m-10">
       Update Project Status
     </h1>
     {projects.length > 0 ? (
       <div className="container grid grid-cols-12 gap-6 mb-4">
         <div
           className="col-span-12 rounded-xl border border-gray-300 p-4 sm:p-8 lg:col-span-12 flex flex-col justify-between"
           style={{ minHeight: "650px" }}
         >
           <div className="flex flex-col gap-4">
             {projects.map((project, index) => (
               <ProjectAdminCard
                 key={project.id || index}
                 id={project.id}
                 title={project.title}
                 projectStatus={project.projectStatus}
                 expirationDate={project.expirationDate}
                 clientId={project.clientId}
                 data-test={`project-${project.id}`}
               />
             ))}
           </div>
           <div className="pt-8">


             <Pagination
               currentPage={currentPage + 1} // The +1 is to start page 0 at number 1.This makes it more readable to start page 1 at number 1.
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
