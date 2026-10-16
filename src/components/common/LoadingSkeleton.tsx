import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl glass-card bg-surface-card/60 border border-surface-border p-4 animate-pulse">
      <div className="aspect-square w-full rounded-xl bg-surface-hover mb-4" />
      <div className="h-3 w-1/3 bg-surface-hover rounded mb-2" />
      <div className="h-4 w-4/5 bg-surface-hover rounded mb-3" />
      <div className="h-3 w-full bg-surface-hover rounded mb-4" />
      <div className="flex justify-between items-center pt-3 border-t border-surface-border">
        <div className="h-5 w-1/3 bg-surface-hover rounded" />
        <div className="h-9 w-9 bg-surface-hover rounded-xl" />
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 rounded-xl bg-surface-card border border-surface-border w-full" />
      ))}
    </div>
  );
};
