import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import ProductCard from './ProductCard';

const VirtualizedProductList = ({ 
  products, 
  variant = 'desktop',
  itemsPerRow = 3,
  itemHeight = 400,
  containerHeight = 600,
  onAddToFavorites
}) => {
  // Группируем товары по строкам
  const groupedProducts = useMemo(() => {
    const groups = [];
    for (let i = 0; i < products.length; i += itemsPerRow) {
      groups.push(products.slice(i, i + itemsPerRow));
    }
    return groups;
  }, [products, itemsPerRow]);

  const Row = ({ index, style }) => {
    const rowProducts = groupedProducts[index];
    
    return (
      <div style={style} className="flex gap-6 px-4">
        {rowProducts.map((product, productIndex) => (
          <div key={product.id} className="flex-1">
            <ProductCard
              product={product}
              variant={variant}
              onAddToFavorites={onAddToFavorites}
            />
          </div>
        ))}
        
        {/* Заполняем пустые места для последней строки */}
        {rowProducts.length < itemsPerRow && (
          Array.from({ length: itemsPerRow - rowProducts.length }).map((_, emptyIndex) => (
            <div key={`empty-${emptyIndex}`} className="flex-1" />
          ))
        )}
      </div>
    );
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 mb-4">
          <svg className="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Товары не найдены
          </h3>
          <p className="text-gray-500">
            Попробуйте изменить параметры поиска или фильтры
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <List
        height={containerHeight}
        itemCount={groupedProducts.length}
        itemSize={itemHeight}
        overscanCount={2} // Рендерим 2 дополнительные строки для плавности
      >
        {Row}
      </List>
    </div>
  );
};

export default VirtualizedProductList;