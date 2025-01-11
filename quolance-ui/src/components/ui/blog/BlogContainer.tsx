"use client";

import { useState } from "react";
import PostCard from "./PostCard";
import Tabs from "./Tabs";
import CreatePostModal from "./CreatePostModal";
import CreatePostForm from "./CreatePostForm";
import SearchBar from "./SearchBar";

import { useAuthGuard } from "@/api/auth-api";

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
    const { user, isLoading } = useAuthGuard({ middleware: 'auth' }); // Get the authenticated user
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    console.log(user);

    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    // Filter posts based on the selected tag
    const filteredPosts = selectedTag
        ? blogPosts.filter((post) => post.tags.includes(selectedTag))
        : blogPosts;

    return (
        <>
            {/* Create Post Modal */}
            <CreatePostModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {/* If the user is not authenticated, show a message to sign in (should be replaced with isLoading || !user) */}
                {isLoading && false ? (
                    <p>Loading...</p>
                ) : !user ? (
                    <CreatePostForm
                        onSubmit={(postData) => {
                            // Submit the post to the server
                            console.log(postData);
                            setIsModalOpen(false);
                        }}
                        onClose={() => setIsModalOpen(false)}
                        user={user}
                    />
                ) : (
                    <div className="flex justify-center items-center h-full">
                        <div className="p-4 text-center">
                            <h2 className="text-lg font-bold mb-2">Sign In Required</h2>
                            <p className="text-gray-700">
                                You must be signed in to create a post. Please log in to continue.
                            </p>
                            <button
                                onClick={() => (window.location.pathname = "/auth/login")}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                )}
            </CreatePostModal>
            {/* Create Post Button and Search Bar*/}
            <div className="relative flex items-center">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="absolute left-0 px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                    Create New Post
                </button>
                <div className="flex-grow mx-auto max-w-lg">
                    <SearchBar />
                </div>
            </div>
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
