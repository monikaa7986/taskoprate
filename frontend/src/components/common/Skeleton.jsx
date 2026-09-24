import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="flex flex-col bg-white rounded-xl overflow-hidden border border-stone-200/60 animate-pulse">
      <div className="w-full aspect-[3/4] bg-stone-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-stone-200 rounded w-1/3" />
        <div className="h-4 bg-stone-200 rounded w-4/5" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-4 bg-stone-200 rounded w-1/4" />
          <div className="h-3 bg-stone-200 rounded w-1/5" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonGrid = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export default { SkeletonCard, SkeletonGrid };
