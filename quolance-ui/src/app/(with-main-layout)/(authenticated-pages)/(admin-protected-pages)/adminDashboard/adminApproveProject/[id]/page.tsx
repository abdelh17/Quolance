"use client";


import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useProjectContext } from '../../../AdminContext/ProjectContext';
import { ConfirmationModal } from '../../../componentsAdmin/ConfirmationModal';
import { ProjectDetails } from '../../../componentsAdmin/ProjectDetails';
import { showToast } from '@/util/context/ToastProvider';


type Project = {
 id: number;
 title: string;
 description: string;
 expirationDate: string; // Assuming this is a date in string format
 visibilityExpirationDate: string | null; // Nullable field
 category: string;
 priceRange: string;
 experienceLevel: string;
 expectedDeliveryTime: string;
 projectStatus: string;
 tags?: string[]; // Array of tags
 clientId: number;
 selectedFreelancerId: number | null; // Nullable field
 applications: any[]; // Assuming applications can be any type; replace with a proper type if available
};


export default function AdminProjectPage() {
 const { id } = useParams();
 const router = useRouter();
 const { projects, updateProjectStatus } = useProjectContext();
 const [project, setProject] = useState<Project | null>(null);
 const [status, setStatus] = useState<string>("");
 const [showModal, setShowModal] = useState<boolean>(false);


 useEffect(() => {
   if (id) {
     const projectId = Number(id);
     const fetchedProject = projects.find((p) => p.id === projectId);
     if (fetchedProject) {
       setProject(fetchedProject);
       setStatus("approved");
     }
   }
 }, [id, projects]);


 const handleStatusChange = (status: string) => {
   setStatus(status)
 };


 const handleSubmit = () => {
   setShowModal(true);
 };


 const handleConfirm = async () => {
   if (project) {
     await updateProjectStatus(project.id, status);
     setShowModal(false);
     showToast(`Project status is updated to ${status}!`, 'success');
     router.push(`/adminDashboard`);
   }
 };


 const handleCancel = () => {
   setShowModal(false);
 };


 return (
   <>
     <ProjectDetails
       project={project}
       status={status}
       onStatusChange={handleStatusChange}
       onSubmit={handleSubmit}
     />


     {showModal && (
       <ConfirmationModal
         status={status}
         onConfirm={handleConfirm}
         onCancel={handleCancel}
       />
     )}
   </>
 );
}
