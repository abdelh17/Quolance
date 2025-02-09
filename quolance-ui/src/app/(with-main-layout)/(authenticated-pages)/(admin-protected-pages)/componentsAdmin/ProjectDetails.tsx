import React, { useState } from "react";
import {
 Listbox,
 ListboxButton,
 ListboxOption,
 ListboxOptions,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";


interface Project {
 id: number;
 title: string;
 description: string;
 expirationDate: string; 
 visibilityExpirationDate: string | null; 
 category: string;
 priceRange: string;
 experienceLevel: string;
 expectedDeliveryTime: string;
 projectStatus: string;
 tags?: string[]; 
 clientId: number;
 selectedFreelancerId: number | null;
 applications: any[]; 
}


interface ProjectDetailsProps {
 project: Project | null;
 status: string;
 onStatusChange: (status: string) => void;
 onSubmit: (reason?: string) => void;
}


const statuses = [
 { id: "approved", name: "Approved" },
 { id: "rejected", name: "Rejected" },
];


export const ProjectDetails: React.FC<ProjectDetailsProps> = ({
 project,
 status,
 onStatusChange,
 onSubmit,
}) => {
 const [selectedStatus, setSelectedStatus] = useState(
   statuses.find((s) => s.id === status) || statuses[0]
 );
 const [rejectionReason, setRejectionReason] = useState("");
 const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);


 const handleStatusChange = (status: { id: string; name: string }) => {
   setSelectedStatus(status);
   onStatusChange(status.id);


   if (status.id === "rejected") {
     setIsSubmitDisabled(true);
   } else {
     setIsSubmitDisabled(false);
   }
 };


 const handleReasonChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
   const value = event.target.value;
   setRejectionReason(value);
   setIsSubmitDisabled(value.trim().length === 0);
 };


 const handleSubmit = () => {
   if (selectedStatus.id === "rejected") {
     onSubmit(rejectionReason);
   } else {
     onSubmit();
   }
 };

 const stripPTags = (html: string) => {
  return html.replace(/<\/?p>/g, '').trim();
 };


 return (
   <>
     <div className="max-w-screen-2xl mx-auto p-4">
       <div className="grid px-4">
         <div>
           <h2 className="text-3xl font-bold text-gray-900 mt-20">
             {project?.title || "Project Title"}
           </h2>
           <p className="mt-4 text-gray-500">
           {project?.description ? stripPTags(project.description) : "No description provided"}
         </p>


           <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
             <div className="border-t border-gray-300 pt-4">
               <dt className="font-medium text-gray-900">Expiration Date</dt>
               <dd className="mt-2 text-sm text-gray-500">
                 {project?.expirationDate || "N/A"}
               </dd>
             </div>
             <div className="border-t border-gray-300 pt-4">
               <dt className="font-medium text-gray-900">
                 Visibility Expiration Date
               </dt>
               <dd className="mt-2 text-sm text-gray-500">
                 {project?.visibilityExpirationDate || "N/A"}
               </dd>
             </div>
             <div className="border-t border-gray-300 pt-4">
               <dt className="font-medium text-gray-900">Category</dt>
               <dd className="mt-2 text-sm text-gray-500">
                 {project?.category || "N/A"}
               </dd>
             </div>
             <div className="border-t border-gray-300 pt-4">
               <dt className="font-medium text-gray-900">Price Range</dt>
               <dd className="mt-2 text-sm text-gray-500">
                 {project?.priceRange || "N/A"}
               </dd>
             </div>
             <div className="border-t border-gray-300 pt-4">
               <dt className="font-medium text-gray-900">Experience Level</dt>
               <dd className="mt-2 text-sm text-gray-500">
                 {project?.experienceLevel || "N/A"}
               </dd>
             </div>
             <div className="border-t border-gray-300 pt-4">
               <dt className="font-medium text-gray-900">
                 Expected Delivery Time
               </dt>
               <dd className="mt-2 text-sm text-gray-500">
                 {project?.expectedDeliveryTime || "N/A"}
               </dd>
             </div>
             <div className="border-t border-gray-300 pt-4">
               <dt className="font-medium text-gray-900">Project Status</dt>
               <dd className="mt-2 text-sm text-gray-500 capitalize">
                 {project?.projectStatus || "N/A"}
               </dd>
             </div>
             <div className="border-t border-gray-300 pt-4">
               <dt className="font-medium text-gray-900">Client ID</dt>
               <dd className="mt-2 text-sm text-gray-500">
                 {project?.clientId || "N/A"}
               </dd>
             </div>
           </dl>
         </div>
       </div>
     </div>


     <div className="max-w-screen-2xl mx-auto p-4">
       <h2 className="text-3xl font-bold text-gray-900 p-4">Change Status</h2>


       <div className="p-4 flex flex-col gap-6 mb-20">
         <div>
           <Listbox value={selectedStatus} onChange={handleStatusChange}>
             <div className="relative">
               <ListboxButton className="lg:w-96 rounded-xl border border-gray-300 p-2 flex items-center justify-between w-full">
                 {selectedStatus.name}
                 <ChevronDownIcon
                   aria-hidden="true"
                   className="h-5 w-5 text-gray-500"
                 />
               </ListboxButton>
               <ListboxOptions className="absolute mt-1 lg:w-96 w-full rounded border bg-white shadow-md z-10">
                 {statuses.map((statusOption) => (
                   <ListboxOption
                     key={statusOption.id}
                     value={statusOption}
                     className={({ active }: { active: boolean }) =>
                       `cursor-pointer select-none px-4 py-2 ${
                         active
                           ? "bg-blue-100 text-blue-900"
                           : "text-gray-900"
                       }`
                     }
                   >
                     {statusOption.name}
                   </ListboxOption>
                 ))}
               </ListboxOptions>
             </div>
           </Listbox>
         </div>


         {selectedStatus.id === "rejected" && (
           <div>
             <h3 className="font-medium text-gray-900 mb-2">
               Reason for Rejection
             </h3>
             <textarea
               value={rejectionReason}
               onChange={handleReasonChange}
               className="w-full rounded-xl border border-gray-300 p-4"
               rows={5}
               data-test="rejection-reason-input"
             />
           </div>
         )}


        


         <div className="flex justify-end ">
               <button
                 onClick={handleSubmit}
                 className={`lg:w-48 w-full border rounded-xl px-3 py-2 text-white ${
                   isSubmitDisabled
                     ? "bg-gray-400 cursor-not-allowed"
                     : "bg-blue-500 hover:bg-yellow-500"
                 }`}
                 disabled={isSubmitDisabled}
                 data-test = "submit-project-btn"
               >
                 Submit
               </button>
             </div>
       </div>
     </div>
   </>
 );
};



