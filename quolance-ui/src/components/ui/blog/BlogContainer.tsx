"use client";

import {useState} from "react";
import PostCard from "./PostCard";
import {useCreateBlogPost, useGetAllBlogPosts} from "@/api/blog-api";
import CreatePostModal from "./CreatePostModal";
import CreatePostForm from "./CreatePostForm";
import SearchBar from "./SearchBar";
import {useAuthGuard} from "@/api/auth-api";
import {showToast} from "@/util/context/ToastProvider";
import {useQueryClient} from "@tanstack/react-query";


const BlogContainer: React.FC = () => {
    //const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [openUserSummaryPostId, setOpenUserSummaryPostId] = useState<number | null>(null);

    const {user, isLoading: userIsLoading} = useAuthGuard({middleware: 'auth'});
    const queryClient = useQueryClient();
    const { data: blogPosts, isLoading: postIsLoading, error } = useGetAllBlogPosts(
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
    // const filteredPosts = selectedTag
    //     ? blogPosts?.filter((post) => post.tags.includes(selectedTag))
    //     : blogPosts;
    const filteredPosts = blogPosts;

    const { mutateAsync: mutateBlogPosts } = useCreateBlogPost({
        onSuccess: () => {
            console.log("Post created successfully!");
            showToast("Post created successfully!", "success");

            // Force a refetch of the blog posts
            queryClient.invalidateQueries({queryKey: ["all-blog-posts"]});
            setIsModalOpen(false);
        },
        onError: (error) => {
            console.error("Error creating post:", error);
            showToast("Error creating post", "error");
        }
    })


    const handleFormSubmit = async (postData: {
        title: string;
        content: string;
        userId: string | undefined;
        files?: File[]
    }) => {
        if (!postData.userId) {
            console.error("User ID is undefined. User must be logged in.");
            showToast("Error: User not logged in.", "error");
            return;
        }
    
        try {
            console.log("Form submitted:", postData);
            await mutateBlogPosts(postData);
        } catch (err) {
            console.log("FORM NOT SUBMITTED AT ALL", postData)
            console.error(err);
        }
    };

    return (
        <>
            {!user ? (
                <>
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
                </>
                ) : (
                <> 
                    {/* Create Post Modal */}
                    <CreatePostModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        {/* If the user is not authenticated, show a message to sign in (should be replaced with isLoading || !user) */}
                        {userIsLoading ? (
                            <p>Loading...</p>
                        ) : user ? (
                            <CreatePostForm
                                onSubmit={handleFormSubmit}
                                onClose={() => setIsModalOpen(false)}
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
                    {/* <Tabs
                        tags={["UX/UI Design", "Backend", "Security", "Finance"]} // each user will have their customized tabs saved in the db and will be fetched on page load
                        onSelectTag={(tag) => setSelectedTag(tag)}
                    /> */}

                    {/* Loading State */}
                    {postIsLoading && <p className="text-center text-gray-500 mt-4">Loading...</p>}

                    {/* Error State */}
                    {error && <p className="text-center text-red-500 mt-4">An error occurred.</p>}

                    {/* Posts Grid */}
                    <div className="grid sm:grid-cols-1 lg:grid-cols-1 gap-6">
                        {filteredPosts?.slice().reverse().map((post, index) => (
                            <PostCard
                                key={index}
                                {...post}
                                openUserSummaryPostId={openUserSummaryPostId}
                                setOpenUserSummaryPostId={setOpenUserSummaryPostId}
                            />
                        ))}
                    </div>

                    {/* No Posts Found */}
                    {!postIsLoading && filteredPosts?.length === 0 && (
                        <p className="text-center text-gray-500 mt-4">No posts found for this tag.</p>
                    )}
                </>
                )}
            
        </>
    );
};

export default BlogContainer;
