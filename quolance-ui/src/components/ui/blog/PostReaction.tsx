"use-client";

import React from "react";
import {
    BiAngry,
    BiHeart,
    BiLaugh,
    BiLike,
    BiSad,
    BiShocked,
    BiSolidAngry,
    BiSolidHeart,
    BiSolidLaugh,
    BiSolidLike,
    BiSolidSad,
    BiSolidShocked,
} from "react-icons/bi";

interface PostReactionProps {
    reaction: string;
    reactionCount: number;
    userReaction: boolean; // If the user has reacted to the post (will determine if the icon is filled or not)
    onReactionClick?: () => void;
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
                <BiSolidLike {...commonProps} style={{ color: "#0218AF" }} />
              ) : (
                <BiLike {...commonProps} />
              );
            case "love":
              return userReaction ? (
                <BiSolidHeart {...commonProps} style={{ color: "#AF0500" }} />
              ) : (
                <BiHeart {...commonProps} />
              );
            case "haha":
              return userReaction ? (
                <BiSolidLaugh {...commonProps} style={{ color: "#DABC00" }} />
              ) : (
                <BiLaugh {...commonProps} />
              );
            case "wow":
              return userReaction ? (
                <BiSolidShocked {...commonProps} style={{ color: "#DABC00" }} />
              ) : (
                <BiShocked {...commonProps} />
              );
            case "sad":
              return userReaction ? (
                <BiSolidSad {...commonProps} style={{ color: "#DABC00" }} />
              ) : (
                <BiSad {...commonProps} />
              );
            case "angry":
              return userReaction ? (
                <BiSolidAngry {...commonProps} style={{ color: "#DABC00" }} />
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