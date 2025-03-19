"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AdminReportedPostDetail from "../../../componentsAdmin/AdminReportedPostDetail";
import { useReportedBlogContext } from "../../../AdminContext/ReportedBlogContext";

export default function SingleReportedPostPage() {
  const { id } = useParams();
  const { blogPosts } = useReportedBlogContext();
  const [post, setPost] = useState<any | null>(null);

  useEffect(() => {
    if (!id) return;
    const found = blogPosts.find((bp) => bp.id === id);
    if (found) {
      setPost(found);
    }
  }, [id, blogPosts]);

  if (!post) {
    return <div>Loading Admin Post...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <AdminReportedPostDetail
        id={post.id}
        title={post.title}
        content={post.content}
        authorName={post.authorName}
        dateCreated={post.dateCreated}
        tags={post.tags}
        imageUrls={post.imageUrls}
      />
    </div>
  );
}
