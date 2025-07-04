import React from 'react';
import { Star } from './Star';

interface RatingRowProps {
  label: string;
  rating: number;
  maxRating?: number;
}

export const RatingRow: React.FC<RatingRowProps> = ({ label, rating, maxRating = 6 }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const stars = [];
  for (let i = 0; i < maxRating; i++) {
    if (i < fullStars) {
      stars.push(<Star key={i} filled size={20} className="text-yellow-500" />);
    } else if (i === fullStars && hasHalf) {
      stars.push(<Star key={i} filled={false} half size={20} className="text-yellow-500" />);
    } else {
      stars.push(<Star key={i} filled={false} size={20} className="text-gray-300" />);
    }
  }
  return (
    <div className="flex items-center justify-between py-2">
      <span className="font-medium text-gray-700">{label}</span>
      <div className="flex gap-1">
        {stars}
      </div>
    </div>
  );
}; 