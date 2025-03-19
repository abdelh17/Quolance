"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useResolvedBlogContext } from "../../../AdminContext/ResolvedBlogContext";
import AdminReportedPostDetail from "../../../componentsAdmin/AdminReportedPostDetail";

export default function SingleResolvedPostPage() {
  const { id } = useParams();
  const { resolvedPosts } = useResolvedBlogContext();
  const [post, setPost] = useState<any | null>(null);

  useEffect(() => {
    if (!id) return;
    const found = resolvedPosts.find((bp) => bp.id === id);
    if (found) {
      setPost(found);
    }
  }, [id, resolvedPosts]);

  if (!post) {
    return <div>Loading Resolved Post...</div>;
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
        hideKeep={true}
      />
    </div>
  );
}
