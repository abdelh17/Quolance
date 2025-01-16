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
 totalPages: number;
 totalElements:number;
 currentPage: number;
 isFirstPage: boolean;
 isLastPage: boolean;
 fetchProjects: (page: number, size: number) => Promise<void>;
 updateProjectStatus: (id: number, status: string) => Promise<void>;
}


const ProjectContext = createContext<ProjectContextType | undefined>(undefined);


export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
 const [projects, setProjects] = useState<Project[]>([]);
 const [totalElements,setTotalElements] = useState<number>(0);
 const [totalPages, setTotalPages] = useState<number>(0);
 const [currentPage, setCurrentPage] = useState<number>(0);
 const [isFirstPage, setIsFirstPage] = useState<boolean>(true);
 const [isLastPage, setIsLastPage] = useState<boolean>(false);
 const initialPage = 0
 const pageSize = 5


 const fetchProjects = async (page: number, size: number) => {
   try {
     const response = await httpClient.get(
       `/api/admin/projects/pending/all?page=${page}&size=${size}`
     );


     const { content,totalElements, totalPages, first, last } = response.data;


     setProjects(content);
     setTotalElements(totalElements);
     setTotalPages(totalPages);
     setCurrentPage(page);
     setIsFirstPage(first);
     setIsLastPage(last);
   } catch (error) {
     console.error("Failed to fetch projects", error);
   }
 };


 useEffect(() => {
   fetchProjects(initialPage, pageSize);
 }, []);


 const updateProjectStatus = async (id: number, newStatus: string) => {
   try {
     if (newStatus === "approved") {
       await httpClient.post(`/api/admin/projects/pending/${id}/approve`);
     } else if (newStatus === "rejected") {
       await httpClient.post(`/api/admin/projects/pending/${id}/reject`);
     }


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
   <ProjectContext.Provider
     value={{
       projects,
       totalPages,
       totalElements,
       currentPage,
       isFirstPage,
       isLastPage,
       fetchProjects,
       updateProjectStatus,
     }}
   >
     {children}
   </ProjectContext.Provider>
 );
};


export const useProjectContext = () => {
 const context = useContext(ProjectContext);
 if (context === undefined) {
   throw new Error("useProjectContext must be used within a ProjectProvider");
 }
 return context;
};
