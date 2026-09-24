import React from 'react';
import ProductCard from './ProductCard';
import { SkeletonGrid } from '../common/Skeleton';
import EmptyState from '../common/EmptyState';

const ProductGrid = ({
  products = [],
  loading = false,
  emptyTitle = 'No garments match your filters',
  emptyDescription = 'Try adjusting your price range, sizes, or category filters to find what you are looking for.',
  onResetFilters,
  onQuickView,
  columns = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
}) => {
  if (loading) {
    return <SkeletonGrid count={8} />;
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={onResetFilters ? 'Clear All Filters' : undefined}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className={`grid ${columns} gap-6`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
