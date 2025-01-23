export type BlogPostViewType = {
    id: number;
    title: string;
    content: string;
    authorName: string;
    dateCreated: string;
    comments: string[];
}

export type BlogPostType = {
    title: string;
    content: string;
    userId: number;
};