import React from 'react';

interface StarProps {
  filled: boolean;
  partial?: 'quarter' | 'half' | 'three-quarter';
  size?: number;
  className?: string;
}

export const Star: React.FC<StarProps> = ({ filled, partial, size = 24, className = '' }) => {
  if (partial) {
    const fillPercentage = {
      'quarter': '25%',
      'half': '50%',
      'three-quarter': '75%'
    }[partial];
    
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={className}
      >
        <defs>
          <linearGradient id={`partial-gradient-${partial}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset={fillPercentage} stopColor="currentColor" />
            <stop offset={fillPercentage} stopColor="transparent" />
          </linearGradient>
        </defs>
        <polygon
          points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          fill={`url(#partial-gradient-${partial})`}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}; 