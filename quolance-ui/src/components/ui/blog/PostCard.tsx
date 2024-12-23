import React from 'react';

interface PostCardProps {
    type: string;
    title: string;
    body: string;
    userName: string;
}

const PostCard: React.FC<PostCardProps> = ({ type, title, body, userName }) => {
  return (
    <div className="p-4 bg-white shadow-md rounded-md">
        <div className="bg-slate-300">
            <h3 className="text-lg font-semibold">[{type}] {title}</h3>
        </div>
        <div className="bg-white">
            <p className="text-gray-700">{body}</p>
            <p className="text-sm text-gray-500">{userName}</p>
        </div>
    </div>
  );
};

export default PostCard;