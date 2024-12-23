import PostCard from "./PostCard";

interface BlogContainerProps {
    blogPosts: {
        type: string;
        title: string;
        body: string;
        userName: string;
    }[];
}

const BlogContainer: React.FC<BlogContainerProps> = ({ blogPosts }) =>{
    return (
        <>
            <div className="grid sm:grid-cols-1 lg:grid-cols-1 gap-6">
                {blogPosts.map((post, index) => (
                <PostCard key={index} {...post} />
                ))}
            </div>
        </>
    )
}

export default BlogContainer;