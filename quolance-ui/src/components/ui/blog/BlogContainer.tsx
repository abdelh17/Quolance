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
import { PaginationParams, PaginationQueryDefault } from "@/constants/types/pagination-types";
import { BlogPostViewType } from "@/constants/types/blog-types";
import { Button } from "@/components/ui/button";


const BlogContainer: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [openUserSummaryPostId, setOpenUserSummaryPostId] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationParams>(PaginationQueryDefault);

    const {user, isLoading: isUserLoading} = useAuthGuard({middleware: 'auth'});
    const queryClient = useQueryClient();
    const { data: pagedPosts, isLoading: isBlogLoading } = useGetAllBlogPosts(pagination);
    console.log(pagedPosts);

    const totalPages = pagedPosts?.totalPages ?? 1;

    const handleNextPage = () => {
        if (pagedPosts?.number >= totalPages - 1) return;
        setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    };

    const handlePrevPage = () => {
        if (pagedPosts?.number === 0) return;
        setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
    };

    const { mutateAsync: mutateBlogPosts } = useCreateBlogPost({
        onSuccess: () => {
            showToast("Post created successfully!", "success");
            queryClient.invalidateQueries({queryKey: ["all-blog-posts"]});
            setIsModalOpen(false);
        },
        onError: (error) => {
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
            showToast("Error: User not logged in.", "error");
            return;
        }
        try {
            await mutateBlogPosts(postData);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            {isUserLoading? (
                <p>Loading...</p>
             ) : (
                <>
                    {!user ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="p-4 text-center">
                                <h2 className="text-lg font-bold mb-2">Sign In Required</h2>
                                <p className="text-gray-700">
                                    You must be signed in to create a post. Please log in to continue.
                                </p>
                                <Button
                                    onClick={() => (window.location.pathname = "/auth/login")}
                                    animation="default"
                                >
                                    Sign In
                                </Button    >
                            </div>
                        </div>
                    ) : (
                        <> 
                            {/* Create Post Modal */}
                            <CreatePostModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                                {isUserLoading ? (
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
                                            <Button
                                                onClick={() => (window.location.pathname = "/auth/login")}
                                                animation="default"
                                            >
                                                Sign In
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CreatePostModal>
                            {/* Create Post Button and Search Bar*/}
                            <div className="relative flex items-center">
                            <Button
                                onClick={() => setIsModalOpen(true)}
                                animation="default"
                            >
                                Create New Post
                            </Button>
                                <div className="flex-grow mx-auto max-w-lg">
                                    <SearchBar />
                                </div>
                            </div>

                            {/* Blog Posts */}
                            <div>
                                {isBlogLoading? (
                                    <p>Loading...</p>
                                ) : pagedPosts.content && pagedPosts?.content?.length > 0 ? (
                                    <>
                                        {pagedPosts.content.map((post: BlogPostViewType, index: number) => (
                                            <PostCard 
                                                key={index} 
                                                {...post} 
                                                openUserSummaryPostId={openUserSummaryPostId}
                                                setOpenUserSummaryPostId={setOpenUserSummaryPostId}
                                            />
                                        ))}
                                        {/* Pagination Controls */}
                                        <div className="flex justify-between mt-4">
                                            <button
                                                onClick={handlePrevPage} 
                                                disabled={pagination.page === 0}
                                            >
                                                Previous
                                            </button>
                                            <span>
                                                Page {pagination.page + 1} of {pagedPosts?.totalPages}
                                            </span>
                                            <button 
                                                onClick={handleNextPage} 
                                                disabled={pagedPosts?.number >= totalPages - 1}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </>
                                    ) : (
                                        <p className="text-center text-gray-500 mt-4">No posts found for this tag.</p>
                                    )
                                }
                            </div>
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default BlogContainer;
