export type BlogPostViewType = {
    id: number;
    title: string;
    content: string;
    authorName: string;
    dateCreated: string;
    comments: CommentType[];
}

export type BlogPostType = {
    title: string;
    content: string;
    userId: number;
};

export type CommentType = {
    authorName: string;
    profilePicture?: string;
    content: string;
    dateCreated: string;
}