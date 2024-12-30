"use client";

import { useState } from "react";
import PostCard from "./PostCard";
import Tabs from "./Tabs";

interface BlogContainerProps {
    blogPosts: {
        type: string;
        title: string;
        body: string;
        userName: string;
        fieldOfWork: string;
        profilePicture: string; // URL
        date: string;
        tags: string[];
    }[];
}

const BlogContainer: React.FC<BlogContainerProps> = ({ blogPosts }) => {
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    // Filter posts based on the selected tag
    const filteredPosts = selectedTag
        ? blogPosts.filter((post) => post.tags.includes(selectedTag))
        : blogPosts;

    return (
        <>
            {/* Tabs Component */}
            <Tabs
                tags={["UX/UI Design", "Backend", "Security", "Finance"]} // each user will have their customized tabs saved in the db and will be fetched on page load
                onSelectTag={(tag) => setSelectedTag(tag)}
            />

            {/* Posts Grid */}
            <div className="grid sm:grid-cols-1 lg:grid-cols-1 gap-6">
                {filteredPosts.map((post, index) => (
                    <PostCard key={index} {...post} />
                ))}
            </div>

            {/* No Posts Found */}
            {filteredPosts.length === 0 && (
                <p className="text-center text-gray-500 mt-4">No posts found for this tag.</p>
            )}
        </>
    );
};

export default BlogContainer;
