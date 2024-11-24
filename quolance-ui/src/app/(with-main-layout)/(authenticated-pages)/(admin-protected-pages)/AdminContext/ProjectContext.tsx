"use client";


import React, { createContext, useContext, useEffect, useState } from "react";
import httpClient from "@/lib/httpClient";


type Project = {
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
 tags: string[];
 clientId: number;
 selectedFreelancerId: number | null;
 applications: any[];
};


interface ProjectContextType {
 projects: Project[];
 updateProjectStatus: (id: number, status: string) => Promise<void>;
}


const ProjectContext = createContext<ProjectContextType | undefined>(undefined);


export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
 const [projects, setProjects] = useState<Project[]>([]);


 useEffect(() => {
   const fetchProjects = async () => {
     try {
       const response = await httpClient.get("/api/admin/projects/pending/all");


     
       const fetchedProjects: Project[] = response.data.map((project: any) => ({
         id: project.id,
         title: project.title,
         description: project.description,
         expirationDate: project.expirationDate,
         visibilityExpirationDate: project.visibilityExpirationDate,
         category: project.category,
         priceRange: project.priceRange,
         experienceLevel: project.experienceLevel,
         expectedDeliveryTime: project.expectedDeliveryTime,
         projectStatus: project.projectStatus.toLowerCase(),
         tags: project.tags || [],
         clientId: project.clientId,
         selectedFreelancerId: project.selectedFreelancerId,
         applications: project.applications || [],
       }));


       setProjects(fetchedProjects);
     } catch (error) {
       console.error("Failed to fetch projects", error);
     }
   };


   fetchProjects();
 }, []);


 // Function to update the project status in both the state and the database
 const updateProjectStatus = async (id: number, newStatus: string) => {
   try {
     // Determine the appropriate API endpoint based on the status
     if (newStatus === "approved") {
       await httpClient.post(`/api/admin/projects/pending/${id}/approve`);
     } else if (newStatus === "rejected") {
       await httpClient.post(`/api/admin/projects/pending/${id}/reject`);
     }


     // Update the status in the state after a successful API response
     setProjects((prevProjects) =>
       prevProjects.map((project) =>
         project.id === id ? { ...project, projectStatus: newStatus } : project
       )
     );
   } catch (error) {
     console.error(`Failed to update project status for project ID ${id}`, error);
   }
 };


 return (
   <ProjectContext.Provider value={{ projects, updateProjectStatus }}>
     {children}
   </ProjectContext.Provider>
 );
};


// Custom hook to use the ProjectContext
export const useProjectContext = () => {
 const context = useContext(ProjectContext);
 if (context === undefined) {
   throw new Error("useProjectContext must be used within a ProjectProvider");
 }
 return context;
};

