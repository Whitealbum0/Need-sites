import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useOptimizedProducts, useOptimizedCategories, usePrefetchProducts } from '../../hooks/useOptimizedProducts';
import VirtualizedProductList from '../Common/VirtualizedProductList';
import LoadingSpinner from '../Common/LoadingSpinner';

const OptimizedDesktopProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name');
  const [priceRange, setPriceRange] = useState(searchParams.get('priceRange') || 'all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Prefetch hook для предзагрузки данных
  const { prefetchProducts } = usePrefetchProducts();

  // Оптимизированные хуки с кешированием
  const { categories, loading: categoriesLoading } = useOptimizedCategories();
  
  const { products, loading, error, refetch } = useOptimizedProducts({
    category: selectedCategory,
    search: searchTerm,
    sortBy: sortBy
  });

  // Синхронизация с URL параметрами
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (searchTerm) params.set('search', searchTerm);
    if (sortBy !== 'name') params.set('sort', sortBy);
    if (priceRange !== 'all') params.set('priceRange', priceRange);
    
    setSearchParams(params);
  }, [selectedCategory, searchTerm, sortBy, priceRange, setSearchParams]);

  // Обновление состояния при изменении URL
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    const sortParam = searchParams.get('sort');
    const priceParam = searchParams.get('priceRange');
    
    if (categoryParam !== selectedCategory) setSelectedCategory(categoryParam || '');
    if (searchParam !== searchTerm) setSearchTerm(searchParam || '');
    if (sortParam !== sortBy) setSortBy(sortParam || 'name');
    if (priceParam !== priceRange) setPriceRange(priceParam || 'all');
  }, [searchParams]);

  // Предзагрузка данных при наведении на фильтры
  const handleCategoryHover = (category) => {
    prefetchProducts({ category, search: searchTerm, sortBy });
  };

  const handleSortHover = (sort) => {
    prefetchProducts({ category: selectedCategory, search: searchTerm, sortBy: sort });
  };

  // Мемоизированная фильтрация по цене
  const filteredProducts = useMemo(() => {
    if (priceRange === 'all') return products;
    
    return products.filter(product => {
      const price = product.price;
      switch (priceRange) {
        case 'under_1000':
          return price < 1000;
        case '1000_5000':
          return price >= 1000 && price <= 5000;
        case '5000_20000':
          return price >= 5000 && price <= 20000;
        case 'over_20000':
          return price > 20000;
        default:
          return true;
      }
    });
  }, [products, priceRange]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchTerm('');
    setSortBy('name');
    setPriceRange('all');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Каталог товаров
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Откройте для себя широкий ассортимент качественных товаров
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar с фильтрами */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Фильтры</h2>
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Очистить всё
                </button>
              </div>

              {/* Поиск */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Поиск товаров
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Введите название товара..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Категории */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Категория
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">Все категории</option>
                  {categories.map((category) => (
                    <option 
                      key={category} 
                      value={category}
                      onMouseEnter={() => handleCategoryHover(category)}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Диапазон цен */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Цена
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="all">Любая цена</option>
                  <option value="under_1000">До 1 000 ₽</option>
                  <option value="1000_5000">1 000 - 5 000 ₽</option>
                  <option value="5000_20000">5 000 - 20 000 ₽</option>
                  <option value="over_20000">Свыше 20 000 ₽</option>
                </select>
              </div>

              {/* Сортировка */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Сортировка
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="name" onMouseEnter={() => handleSortHover('name')}>По названию</option>
                  <option value="price_low" onMouseEnter={() => handleSortHover('price_low')}>Сначала дешёвые</option>
                  <option value="price_high" onMouseEnter={() => handleSortHover('price_high')}>Сначала дорогие</option>
                  <option value="newest" onMouseEnter={() => handleSortHover('newest')}>Сначала новые</option>
                </select>
              </div>

              {/* Статистика */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-blue-900">
                    Найдено товаров: {filteredProducts.length}
                  </span>
                </div>
                <div className="text-xs text-blue-700">
                  {selectedCategory && `Категория: ${selectedCategory}`}
                  {searchTerm && ` • Поиск: "${searchTerm}"`}
                </div>
              </div>
            </div>
          </div>

          {/* Основной контент */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="large" text="Загружаем товары..." />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-600 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold">Ошибка загрузки</h3>
                  <p className="text-gray-600 mt-2">{error}</p>
                </div>
                <button
                  onClick={refetch}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Попробовать снова
                </button>
              </div>
            ) : (
              <VirtualizedProductList
                products={filteredProducts}
                variant="desktop"
                itemsPerRow={3}
                itemHeight={450}
                containerHeight={800}
                onAddToFavorites={(product) => console.log('Add to favorites:', product)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizedDesktopProducts;