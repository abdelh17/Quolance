"use client";

import { useState } from "react";
import PostCard from "./PostCard";
import Tabs from "./Tabs";
import CreatePostModal from "./CreatePostModal";
import CreatePostForm from "./CreatePostForm";

import icon from "@/public/images/freelancer_default_icon.png";

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
    const [isModalOpen, setIsModalOpen] = useState<boolean | null>(false);

    // Filter posts based on the selected tag
    const filteredPosts = selectedTag
        ? blogPosts.filter((post) => post.tags.includes(selectedTag))
        : blogPosts;

    return (
        <>
            {/* Create Post Modal */}
            <CreatePostModal open={isModalOpen} onClose={() => setIsModalOpen(false)} >
                <CreatePostForm
                    onSubmit={(postData) => {
                        // Submit the post to the server
                        console.log(postData);
                        setIsModalOpen(false);
                    }}
                    onClose={() => setIsModalOpen(false)}
                    user={{ name: "John Doe", profilePicture: { icon } }}
                />
            </CreatePostModal>
            {/* Create Post Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
                Create New Post
            </button>
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
