import React from 'react';

// Basic skeleton block utility
export const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={`animate-pulse rounded bg-zinc-200 dark:bg-zinc-800 ${className}`}
    />
  );
};

// Premium fashion-inspired product skeleton
export const ProductSkeleton = () => {
  return (
    <div className="flex flex-col bg-white overflow-hidden animate-pulse">
      {/* 3:4 Aspect ratio for elegant fashion presentation */}
      <div className="aspect-[3/4] bg-zinc-100" />
      <div className="py-5 px-3 flex flex-col flex-1 items-center gap-3">
        <div className="h-3 bg-zinc-100 w-1/4 rounded-sm" />
        <div className="h-4 bg-zinc-100 w-4/5 rounded-sm" />
        <div className="h-5 bg-zinc-100 w-1/3 rounded-sm mt-2" />
      </div>
    </div>
  );
};
export default ProductSkeleton;
