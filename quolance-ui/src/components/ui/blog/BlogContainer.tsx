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

const BlogContainer: React.FC<BlogContainerProps> = ({ blogPosts }) =>{
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    const filteredPosts = selectedTag
        ? blogPosts.filter((post) => post.tags.includes(selectedTag))
        : blogPosts;

    return (
        <>
            <Tabs
                tags={["UX/UI Design", "Backend", "Security", "Finance"]} // each user will have their customized tabs saved in the db and will be fetched on page load
                onSelectTag={(tag) => setSelectedTag(tag)}
            />
            <div className="grid sm:grid-cols-1 lg:grid-cols-1 gap-6">
                {blogPosts.map((post, index) => (
                <PostCard key={index} {...post} />
                ))}
            </div>
        </>
    )
}

export default BlogContainer;