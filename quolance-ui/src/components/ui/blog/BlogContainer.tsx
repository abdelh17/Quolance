"use client";

import { useState } from "react";
import PostCard from "./PostCard";
import Tabs from "./Tabs";
import { useGetAllBlogPosts } from "@/api/blog-api";
import { BlogPostViewType } from "@/constants/types/blog-types";

const BlogContainer: React.FC = () => {
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    const { data: blogPosts, isLoading, error } = useGetAllBlogPosts(
        {
            onSuccess: (data) => {
                console.log(data);
            },
            onError: (error) => {
                console.log(error);
            },
        }
    );

    // Filter posts based on the selected tag
    const filteredPosts = selectedTag
        ? blogPosts?.filter((post) => post.tags.includes(selectedTag))
        : blogPosts;

    return (
        <>
            {/* Tabs Component */}
            <Tabs
                tags={["UX/UI Design", "Backend", "Security", "Finance"]} // each user will have their customized tabs saved in the db and will be fetched on page load
                onSelectTag={(tag) => setSelectedTag(tag)}
            />

            {/* Loading State */}
            {isLoading && <p className="text-center text-gray-500 mt-4">Loading...</p>}

            {/* Error State */}
            {error && <p className="text-center text-red-500 mt-4">An error occurred.</p>}

            {/* Posts Grid */}
            <div className="grid sm:grid-cols-1 lg:grid-cols-1 gap-6">
                {filteredPosts?.map((post, index) => (
                    <PostCard key={index} {...post} />
                ))}
            </div>

            {/* No Posts Found */}
            {!isLoading && filteredPosts?.length === 0 && (
                <p className="text-center text-gray-500 mt-4">No posts found for this tag.</p>
            )}
        </>
    );
};

export default BlogContainer;
