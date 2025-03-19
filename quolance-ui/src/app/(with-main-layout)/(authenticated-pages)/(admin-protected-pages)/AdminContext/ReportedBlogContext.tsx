// app/AdminContext/ReportedBlogContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import httpClient from "@/lib/httpClient"; // same place your ProjectContext uses

type BlogPost = {
  id: string;
  title: string;
  content: string;
  dateCreated: string;
  authorName?: string;
};

interface ReportedBlogContextType {
  blogPosts: BlogPost[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  // 2) methods
  fetchBlogPosts: (page: number, size: number) => Promise<void>;
  updatePostStatus: (postId: string, status: "kept" | "deleted") => Promise<void>;
}

const ReportedBlogContext = createContext<ReportedBlogContextType | undefined>(undefined);

export const ReportedBlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [isLastPage, setIsLastPage] = useState(false);

  // same approach as ProjectContext
  const initialPage = 0;
  const pageSize = 5;

  const fetchBlogPosts = async (page: number, size: number) => {
    try {
      const response = await httpClient.get(`/api/admin/blog-posts/reported?page=${page}&size=${size}`);

      const { content, totalElements, totalPages, first, last } = response.data;

      setBlogPosts(content);
      setTotalElements(totalElements);
      setTotalPages(totalPages);
      setCurrentPage(page);
      setIsFirstPage(first);
      setIsLastPage(last);

    } catch (error) {
      console.error("Failed to fetch reported blog posts:", error);
    }
  };

  useEffect(() => {
    fetchBlogPosts(initialPage, pageSize);
  }, []);

 
  const updatePostStatus = async (postId: string, newStatus: "kept" | "deleted") => {
    try {
      if (newStatus === "kept") {
        await httpClient.post(`/api/admin/blog-posts/reported/${postId}/keep`);
      } else {
        await httpClient.delete(`/api/admin/blog-posts/reported/${postId}`);
      }
      setBlogPosts((prev) => prev.filter((bp) => bp.id !== postId));
    } catch (error) {
      console.error(`Failed to update post status for ID ${postId}`, error);
    }
  };

  const contextValue = useMemo(
    () => ({
      blogPosts,
      totalElements,
      totalPages,
      currentPage,
      isFirstPage,
      isLastPage,
      fetchBlogPosts,
      updatePostStatus,
    }),
    [
      blogPosts,
      totalElements,
      totalPages,
      currentPage,
      isFirstPage,
      isLastPage,
    ]
  );

  return (
    <ReportedBlogContext.Provider value={contextValue}>
      {children}
    </ReportedBlogContext.Provider>
  );
};

export const useReportedBlogContext = () => {
  const context = useContext(ReportedBlogContext);
  if (context === undefined) {
    throw new Error("useReportedBlogContext must be used within a ReportedBlogProvider");
  }
  return context;
};
