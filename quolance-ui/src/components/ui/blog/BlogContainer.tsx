"use client";

import {useCallback, useRef, useState} from "react";
import PostCard from "./PostCard";
import {useCreateBlogPost, useGetAllBlogPosts, useUpdateBlogPost} from "@/api/blog-api";
import CreatePostModal from "./CreatePostModal";
import CreatePostForm from "./CreatePostForm";
import SearchBar from "./SearchBar";
import {useAuthGuard} from "@/api/auth-api";
import {showToast} from "@/util/context/ToastProvider";
import {useQueryClient} from "@tanstack/react-query";
import { PaginationParams, PaginationQueryDefault } from "@/constants/types/pagination-types";
import { BlogPostViewType } from "@/constants/types/blog-types";
import { Button } from "@/components/ui/button";
import Loading from "../loading/loading";


const BlogContainer: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [openUserSummaryPostId, setOpenUserSummaryPostId] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationParams>(PaginationQueryDefault);

    const {user, isLoading: isUserLoading} = useAuthGuard({middleware: 'auth'});
    const queryClient = useQueryClient();
    
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useGetAllBlogPosts();

    const observerRef = useRef<IntersectionObserver | null>(null);

    const lastPostRef = useCallback(
        (node: HTMLDivElement) => {
          if (isLoading || isFetchingNextPage || !hasNextPage) return;
      
          if (observerRef.current) {
            observerRef.current.disconnect();
          }
      
          observerRef.current = new IntersectionObserver(
            (entries) => {
              const lastPost = entries[0];
              if (lastPost.isIntersecting) {
                fetchNextPage();
              }
            },
            {
              root: null,
              rootMargin: "0px",
              threshold: 1.0,
            }
          );
      
          if (node) observerRef.current.observe(node);
        },
        [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]
      );

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

    const { mutateAsync: updateBlogPost } = useUpdateBlogPost({
        onSuccess: () => {
          showToast("Post updated successfully!", "success");
          queryClient.invalidateQueries({queryKey: ["all-blog-posts"]});
        },
        onError: (error) => {
          showToast("Error updating post", "error");
        }
      });

    const handleFormSubmit = async (postData: {
        id?: string;
        title: string;
        content: string;
        userId?: string;
        files?: File[]
        tags: string[];
    }) => {
        if (!user?.id) {
            showToast("Error: User not logged in.", "error");
            return;
        }
        try {
            if (postData.id) {
                await updateBlogPost({
                    postId: postData.id, 
                    title: postData.title, 
                    content: postData.content
                    // tags: postData.tags,
                    // files: postData.files
                });
            } else {
                await mutateBlogPosts({
                    title: postData.title, 
                    content: postData.content, 
                    userId: postData.userId, 
                    tags: postData.tags, 
                    files: postData.files
                });
            }
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
                                <h2 data-test="blog-title-unauthenticated" className="text-lg font-bold mb-2">Sign In Required</h2>
                                <p data-test="blog-desc-unauthenticated" className="text-gray-700">
                                    You must be signed in to create a post. Please log in to continue.
                                </p>
                                <Button
                                    data-test="blog-btn-unauthenticated"
                                    onClick={() => (window.location.pathname = "/auth/login")}
                                    animation="default"
                                >
                                    Sign In
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <> 
                            {/* Create Post Modal */}
                            <CreatePostModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                                {isUserLoading ? (
                                    <Loading />
                                ) : user ? (
                                    <CreatePostForm
                                        onSubmit={({ userId, ...postData }) => handleFormSubmit(postData)}
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
                            <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
                                <Button
                                    onClick={() => setIsModalOpen(true)}
                                    animation="default"
                                    className="w-full md:w-auto"
                                >
                                    Create New Post
                                </Button>
                                <div className="w-full">
                                    <SearchBar />
                                </div>
                            </div>

                            {/* Blog Posts */}
                            <div className="space-y-4 w-full">
                                {isLoading ? (
                                    <Loading />
                                ) : (
                                    <>
                                        {data?.pages.map((page, pageIndex) =>
                                            page.content.map((post: BlogPostViewType, index: number) => {
                                                const isLastPost = (pageIndex === data.pages.length - 1) && (index === page.content.length - 1);

                                                return (
                                                    <div
                                                        key={post.id}
                                                        ref={isLastPost ? lastPostRef : undefined}
                                                    >
                                                        <PostCard
                                                            {...post}
                                                            openUserSummaryPostId={openUserSummaryPostId}
                                                            setOpenUserSummaryPostId={setOpenUserSummaryPostId}
                                                            onSubmit={(postData) => handleFormSubmit(postData)}
                                                        />
                                                    </div>
                                                );
                                            })
                                        )}
                                    </>
                                )}

                                {isFetchingNextPage && (
                                    <div className="flex justify-center items-center h-24">
                                        <Loading />
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default BlogContainer;
