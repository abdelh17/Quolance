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
        const commonProps = {
          size: 24,
          style: { cursor: "pointer" },
        };
        switch (reaction) {
            case "like":
              return userReaction ? (
                <BiSolidLike {...commonProps} style={{ color: "blue" }} />
              ) : (
                <BiLike {...commonProps} />
              );
            case "love":
              return userReaction ? (
                <BiSolidHeart {...commonProps} style={{ color: "red" }} />
              ) : (
                <BiHeart {...commonProps} />
              );
            case "laugh":
              return userReaction ? (
                <BiSolidLaugh {...commonProps} style={{ color: "yellow" }} />
              ) : (
                <BiLaugh {...commonProps} />
              );
            case "shocked":
              return userReaction ? (
                <BiSolidShocked {...commonProps} style={{ color: "yellow" }} />
              ) : (
                <BiShocked {...commonProps} />
              );
            case "sad":
              return userReaction ? (
                <BiSolidSad {...commonProps} style={{ color: "yellow" }} />
              ) : (
                <BiSad {...commonProps} />
              );
            case "angry":
              return userReaction ? (
                <BiSolidAngry {...commonProps} style={{ color: "yellow" }} />
              ) : (
                <BiAngry {...commonProps} />
              );
          }
        };
      
        return (
          <div className="flex items-center">
            <button onClick={onReactionClick} className="focus:outline-none">
              {renderReactionIcon()}
            </button>
            <p className="ml-1">{reactionCount}&nbsp;&nbsp;</p>
          </div>
        );
      };
      
      export default PostReaction;