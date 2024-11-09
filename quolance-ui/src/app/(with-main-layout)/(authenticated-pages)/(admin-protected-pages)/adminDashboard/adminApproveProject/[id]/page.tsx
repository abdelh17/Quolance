"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useProjectContext } from '../../../AdminContext/ProjectContext';
import { ConfirmationModal } from '../../../componentsAdmin/ConfirmationModal';
import { ProjectDetails } from '../../../componentsAdmin/ProjectDetails';

type Project = {
  id: number;
  name: string;
  description: string;
  tags: string[];
  clientId: number;
  status: string;
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

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(event.target.value);
  };

  const handleSubmit = () => {
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (project) {
      await updateProjectStatus(project.id, status);
      setShowModal(false);
      router.push(`/adminDashboard/adminToastPage?message=Updating+project+status...&successMessage=Project+is+${status}!`);
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
