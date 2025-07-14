import React from 'react';
import { formatPrice, truncateText } from '../../utils/helpers';
import CartButton from './CartButton';
import LazyImage from './LazyImage';

const OptimizedProductCard = React.memo(({ 
  product, 
  variant = 'default', 
  showFullDescription = false,
  onAddToFavorites = null 
}) => {
  if (!product) return null;

  const handleAddToFavorites = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToFavorites) {
      onAddToFavorites(product);
    }
  };

  // Десктопная версия карточки
  if (variant === 'desktop') {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full group">
        <div className="relative overflow-hidden">
          <LazyImage
            src={product.images && product.images.length > 0 ? `data:image/jpeg;base64,${product.images[0]}` : null}
            alt={product.name}
            className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-110"
            placeholder={
              <div className="w-full h-72 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <div className="animate-pulse">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            }
          />
          
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            {onAddToFavorites && (
              <button
                onClick={handleAddToFavorites}
                className="bg-white p-2 rounded-full shadow-lg text-gray-600 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="mb-3">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {showFullDescription ? product.description : truncateText(product.description, 100)}
            </p>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl font-bold text-blue-600">
              {formatPrice(product.price)}
            </div>
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {product.category}
            </div>
          </div>

          <div className="space-y-3">
            <a 
              href={`/products/${product.id}`}
              className="block w-full bg-gray-100 text-gray-700 text-center px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Подробнее
            </a>
            
            {product.stock > 0 && (
              <CartButton product={product} variant="secondary" />
            )}
          </div>
        </div>
      </div>
    );
  }

  // Мобильная версия карточки
  if (variant === 'mobile') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
        <div className="flex p-4 space-x-4">
          <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
            <LazyImage
              src={product.images && product.images.length > 0 ? `data:image/jpeg;base64,${product.images[0]}` : null}
              alt={product.name}
              className="w-full h-full object-cover"
              placeholder={
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <div className="animate-pulse">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              }
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {truncateText(product.description, 80)}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {formatPrice(product.price)}
                </div>
                <div className="text-xs text-gray-500">
                  {product.category}
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                {product.stock > 0 ? (
                  <CartButton product={product} variant="primary" />
                ) : (
                  <span className="text-sm text-red-600">Нет в наличии</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Стандартная версия карточки
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="relative overflow-hidden">
        <LazyImage
          src={product.images && product.images.length > 0 ? `data:image/jpeg;base64,${product.images[0]}` : null}
          alt={product.name}
          className="w-full h-48 object-cover"
          placeholder={
            <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <div className="animate-pulse">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          }
        />
      </div>

      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600">
            {showFullDescription ? product.description : truncateText(product.description, 100)}
          </p>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="text-xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </div>
          <div className="text-sm text-gray-500">
            {product.category}
          </div>
        </div>

        <div className="space-y-2">
          {product.stock > 0 ? (
            <CartButton product={product} variant="primary" />
          ) : (
            <div className="text-center py-2 text-red-600">
              Нет в наличии
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

OptimizedProductCard.displayName = 'OptimizedProductCard';

export default OptimizedProductCard;