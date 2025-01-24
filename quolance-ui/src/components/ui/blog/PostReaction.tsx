"use-client";

import React from "react";
import { 
    BiHeart, BiSolidHeart, 
    BiHappyHeartEyes, BiSolidHappyHeartEyes, 
    BiAngry, BiSolidAngry, 
    BiLike, BiSolidLike, 
    BiLaugh, BiSolidLaugh,
    BiSad, BiSolidSad,
    BiShocked, BiSolidShocked,
} from "react-icons/bi";

interface PostReactionProps {
    reaction: string;
    reactionCount: number;
    userReaction: boolean; // If the user has reacted to the post (will determine if the icon is filled or not)
    onReactionClick: () => void;
}

const PostReaction: React.FC<PostReactionProps> = ({ 
    reaction, 
    reactionCount, 
    userReaction, 
    onReactionClick, 
}) => {
    const renderReactionIcon = () => {
        switch (reaction) {
            case "like":
                return userReaction ? <BiSolidLike /> : <BiLike />;
            case "love":
                return userReaction ? <BiSolidHeart /> : <BiHeart />;
            case "laugh":
                return userReaction ? <BiSolidLaugh /> : <BiLaugh />;
            case "shocked":
                return userReaction ? <BiSolidShocked /> : <BiShocked />;
            case "sad":
                return userReaction ? <BiSolidSad /> : <BiSad />;
            case "angry":
                return userReaction ? <BiSolidAngry /> : <BiAngry />;
        }
    }

    return (
        <button
            onClick={onReactionClick}
            className="flex items-center gap-1 px-2 py-1 text-gray-700 hover:text-blue-500 focus:outline-none"
        >
            {renderReactionIcon()}
            <p className="ml-1">{reactionCount}</p>
        </button>
    );
}

export default PostReaction;