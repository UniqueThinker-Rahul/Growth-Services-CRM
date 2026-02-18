import React from 'react';

interface SkeletonProps {
  className?: string;
  count?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({ className, count = 1 }) => {
  return (
    <>
      {Array(count).fill(0).map((_, i) => (
        <div 
          key={i} 
          className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} 
        />
      ))}
    </>
  );
};

export default Skeleton;