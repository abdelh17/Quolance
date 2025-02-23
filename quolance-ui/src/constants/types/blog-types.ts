export type BlogPostViewType = {
    id: string;
    title: string;
    content: string;
    authorName: string;
    dateCreated: string;
    comments: CommentType[];
}

export type BlogPostType = {
    title: string;
    content: string;
    userId: string;
};

export type CommentType = {
    authorName: string;
    profilePicture?: string;
    content: string;
    dateCreated: string;
}