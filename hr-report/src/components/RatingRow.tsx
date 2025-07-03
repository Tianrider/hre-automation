import { Star } from '@/components/Star';

interface RatingRowProps {
  label: string;
  rating: number;
  maxRating?: number;
}

export const RatingRow = ({ label, rating, maxRating = 6 }: RatingRowProps) => {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="font-medium text-gray-700">{label}</span>
      <div className="flex gap-1">
        {Array.from({ length: maxRating }, (_, index) => (
          <Star
            key={index}
            filled={index < rating}
            size={20}
            className={index < rating ? 'text-yellow-500' : 'text-gray-300'}
          />
        ))}
      </div>
    </div>
  );
}; 