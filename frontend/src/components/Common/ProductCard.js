import React from 'react';
import { formatPrice, truncateText } from '../../utils/helpers';
import CartButton from './CartButton';

const ProductCard = ({ 
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
          {product.images && product.images.length > 0 ? (
            <img 
              src={`data:image/jpeg;base64,${product.images[0]}`}
              alt={product.name}
              className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-72 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            {onAddToFavorites && (
              <button
                onClick={handleAddToFavorites}
                className="bg-white/90 hover:bg-white text-red-500 p-2 rounded-full shadow-lg transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            )}
          </div>

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                Нет в наличии
              </span>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-3 line-clamp-2">{product.name}</h3>
          <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
            {showFullDescription ? product.description : truncateText(product.description, 100)}
          </p>
          
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-2xl font-bold text-blue-600">
                {formatPrice(product.price)}
              </span>
              <div className="text-sm text-gray-500">
                {product.category}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <a 
              href={`/products/${product.id}`}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-center block shadow-lg hover:shadow-xl"
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
      <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="flex">
          {product.images && product.images.length > 0 ? (
            <img 
              src={`data:image/jpeg;base64,${product.images[0]}`}
              alt={product.name}
              className="w-24 h-24 object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          <div className="flex-1 p-4">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm">
              {product.name}
            </h3>
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
              {truncateText(product.description, 80)}
            </p>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="text-lg font-bold text-blue-600">
                  {formatPrice(product.price)}
                </span>
                <div className="text-xs text-gray-500">
                  {product.category}
                </div>
              </div>
              
              <div className="flex space-x-2">
                {product.stock > 0 ? (
                  <CartButton product={product} variant="primary" />
                ) : (
                  <span className="text-sm text-red-600">Нет в наличии</span>
                )}
                
                <a 
                  href={`/products/${product.id}`}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
                >
                  Купить
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Стандартная версия карточки
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {product.images && product.images.length > 0 ? (
        <img 
          src={`data:image/jpeg;base64,${product.images[0]}`}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">Нет изображения</span>
        </div>
      )}
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {truncateText(product.description, 100)}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-blue-600">
            {formatPrice(product.price)}
          </span>
          <a 
            href={`/products/${product.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            Подробнее
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;