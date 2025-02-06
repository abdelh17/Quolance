"use client";


import {useParams, useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';

import {showToast} from '@/util/context/ToastProvider';

import {useProjectContext} from '../../../AdminContext/ProjectContext';
import {ConfirmationModal} from '../../../componentsAdmin/ConfirmationModal';
import {ProjectDetails} from '../../../componentsAdmin/ProjectDetails';


type Project = {
  id: string;
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
  clientId: string;
  selectedFreelancerId: string | null;
applications: any[]; 
};




export default function AdminProjectPage() {
const { id } = useParams();
const router = useRouter();
const { projects, updateProjectStatus,fetchProjects } = useProjectContext();
const [project, setProject] = useState<Project | null>(null);
const [status, setStatus] = useState<string>("");
const [showModal, setShowModal] = useState<boolean>(false);
const initialPage = 0
const pageSize = 5




useEffect(() => {
  if (id) {
    const projectId = String(id);
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
    fetchProjects(initialPage, pageSize);
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

