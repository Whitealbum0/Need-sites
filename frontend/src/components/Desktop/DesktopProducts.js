import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts, useCategories } from '../../hooks/useProducts';
import ProductCard from '../Common/ProductCard';
import LoadingSpinner from '../Common/LoadingSpinner';

const DesktopProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name');
  const [priceRange, setPriceRange] = useState(searchParams.get('priceRange') || 'all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { products, loading, error, refetch } = useProducts({
    category: selectedCategory,
    search: searchTerm
  });

  const { categories } = useCategories();

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

  // Функция сортировки товаров
  const sortProducts = (products) => {
    const sortedProducts = [...products];
    
    switch (sortBy) {
      case 'price_low':
        return sortedProducts.sort((a, b) => a.price - b.price);
      case 'price_high':
        return sortedProducts.sort((a, b) => b.price - a.price);
      case 'name':
        return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':
        return sortedProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      default:
        return sortedProducts;
    }
  };

  // Функция фильтрации по цене
  const filterByPrice = (products) => {
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
  };

  const filteredAndSortedProducts = sortProducts(filterByPrice(products));

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
                    <option key={category} value={category}>
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
                  <option value="name">По названию</option>
                  <option value="price_low">Сначала дешёвые</option>
                  <option value="price_high">Сначала дорогие</option>
                  <option value="newest">Сначала новые</option>
                </select>
              </div>

              {/* Статистика */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-blue-900">
                    Найдено товаров: {filteredAndSortedProducts.length}
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
            ) : filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <svg className="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Товары не найдены
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Попробуйте изменить параметры поиска или фильтры
                  </p>
                  <button
                    onClick={clearFilters}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="desktop"
                    onAddToFavorites={(product) => console.log('Add to favorites:', product)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopProducts;