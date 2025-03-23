"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import httpClient from "@/lib/httpClient";

type BlogPost = {
  id: string;
  title: string;
  content: string;
  dateCreated: string;
};

interface ResolvedBlogContextType {
  resolvedPosts: BlogPost[];
  totalPages: number;
  currentPage: number;
  fetchResolvedBlogPosts: (page: number, size: number) => Promise<void>;
  deleteResolvedPost: (id: string) => Promise<void>;
}

const ResolvedBlogContext = createContext<ResolvedBlogContextType | undefined>(undefined);

export function ResolvedBlogProvider({ children }: { children: React.ReactNode }) {
  const [resolvedPosts, setResolvedPosts] = useState<BlogPost[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const pageSize = 5;
  const initialPage = 0;

  async function fetchResolvedBlogPosts(page: number, size: number) {
    try {
      // GET /api/admin/blog-posts/resolved?page=${page}&size=${size}
      const response = await httpClient.get(
        `/api/admin/blog-posts/resolved?page=${page}&size=${size}`
      );
      const { content, totalPages } = response.data;
      setResolvedPosts(content);
      setTotalPages(totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch resolved blog posts:", error);
    }
  }

  async function deleteResolvedPost(postId: string) {
    try {
      await httpClient.delete(`/api/admin/blog-posts/reported/${postId}`);
      setResolvedPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (error) {
      console.error("Failed to delete resolved blog post:", error);
      throw error;
    }
  }

  useEffect(() => {
    fetchResolvedBlogPosts(initialPage, pageSize);
  }, []);

  const value = useMemo(
    () => ({
      resolvedPosts,
      totalPages,
      currentPage,
      fetchResolvedBlogPosts,
      deleteResolvedPost,
    }),
    [resolvedPosts, totalPages, currentPage]
  );

  return (
    <ResolvedBlogContext.Provider value={value}>
      {children}
    </ResolvedBlogContext.Provider>
  );
}

export function useResolvedBlogContext() {
  const context = useContext(ResolvedBlogContext);
  if (!context) {
    throw new Error("useResolvedBlogContext must be used within a ResolvedBlogProvider");
  }
  return context;
}
