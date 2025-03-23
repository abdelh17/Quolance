"use client";

import { useEffect } from "react";
import { FaBan } from "react-icons/fa";
import Pagination from "../../componentsAdmin/Pagination";
import { useResolvedBlogContext } from "../../AdminContext/ResolvedBlogContext"; 

function AdminResolvedBlogCard(props: {
  id: string;
  title: string;
  content: string;
  dateCreated: string;
}) {
  const snippet = props.content.length > 150 ? props.content.slice(0, 150) + "..." : props.content;

  return (
    <div className="border border-gray-300 p-4 rounded-md">
      <h2 className="font-semibold mb-2">{props.title}</h2>
      <p className="text-sm text-gray-700">{snippet}</p>

      <a
        href={`/adminDashboard/adminResolvedBlogPosts/${props.id}`}
        className="text-blue-600 text-sm mt-2 block"
      >
        View Details
      </a>
    </div>
  );
}

export default function AdminResolvedBlogPostsPage() {
  const {
    resolvedPosts,
    totalPages,
    currentPage,
    fetchResolvedBlogPosts,
  } = useResolvedBlogContext();

  const pageSize = 5;

  useEffect(() => {
    fetchResolvedBlogPosts(0, pageSize);
  }, []);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      fetchResolvedBlogPosts(pageNumber - 1, pageSize);
    }
  };

  return (
    <div>
      <h1 className="text-center text-3xl font-semibold mt-8 mb-6">
        Resolved Blog Posts
      </h1>

      {resolvedPosts.length > 0 ? (
        <div className="container grid grid-cols-12 gap-6">
          <div
            className="col-span-12 rounded-xl border border-gray-300 p-6 flex flex-col"
            style={{ minHeight: "650px" }}
          >
            <div className="flex flex-col gap-4">
              {resolvedPosts.map((post) => (
                <AdminResolvedBlogCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  content={post.content}
                  dateCreated={post.dateCreated}
                />
              ))}
            </div>

            <div className="mt-auto pt-8">
              <Pagination
                currentPage={currentPage + 1}
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
            No resolved blog posts
          </div>
          <FaBan size={75} className="mx-auto mb-4 mt-4" />
        </div>
      )}
    </div>
  );
}
