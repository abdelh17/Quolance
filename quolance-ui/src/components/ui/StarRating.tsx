import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  color?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  maxStars = 5, 
  size = 18, 
  color = "text-yellow-500" 
}) => {
  // Convert rating to a number and ensure it's between 0 and maxStars
  const numericRating = Math.min(Math.max(0, Number(rating) || 0), maxStars);
  
  return (
    <div className="flex items-center">
      {[...Array(maxStars)].map((_, index) => {
        // For each position, determine if we need a full, half, or empty star
        if (index + 0.5 < numericRating) {
          // Full star
          return (
            <Star 
              key={index} 
              size={size} 
              className={`${color} fill-current`} 
            />
          );
        } else if (index < numericRating) {
          // Half star
          return (
            <StarHalf 
              key={index} 
              size={size} 
              className={`${color} fill-current`} 
            />
          );
        } else {
          // Empty star
          return (
            <Star 
              key={index} 
              size={size} 
              className={`${color} stroke-current`} 
              fill="none" 
            />
          );
        }
      })}
      
      {/* Optionally display the numeric rating */}
      {/* <span className="ml-2 text-sm text-gray-600">{numericRating.toFixed(1)}</span> */}
    </div>
  );
};

export default StarRating;