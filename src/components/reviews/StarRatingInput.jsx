import React, { useState } from 'react';
    import { Star } from 'lucide-react';
    import { cn } from '@/lib/utils';

    const StarRatingInput = ({ rating, setRating, maxRating = 5, size = 24, className, starClassName }) => {
      const [hoverRating, setHoverRating] = useState(0);

      const handleMouseEnter = (index) => {
        setHoverRating(index);
      };

      const handleMouseLeave = () => {
        setHoverRating(0);
      };

      const handleClick = (index) => {
        setRating(index);
      };

      return (
        <div className={cn("flex items-center space-x-1", className)}>
          {[...Array(maxRating)].map((_, i) => {
            const starValue = i + 1;
            return (
              <Star
                key={starValue}
                size={size}
                className={cn(
                  "cursor-pointer transition-colors duration-150",
                  (hoverRating || rating) >= starValue
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-slate-300 dark:text-slate-600",
                  starClassName
                )}
                onMouseEnter={() => handleMouseEnter(starValue)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(starValue)}
              />
            );
          })}
        </div>
      );
    };

    export default StarRatingInput;