import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts, useCategories } from '../../hooks/useProducts';
import ProductCard from '../Common/ProductCard';
import LoadingSpinner from '../Common/LoadingSpinner';

const MobileProducts = () => {
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
    setIsFilterOpen(false);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Мобильный Header */}
      <div className="bg-white shadow-sm border-b sticky top-14 z-30">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">
            Каталог товаров
          </h1>
          
          {/* Поиск */}
          <div className="relative mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Поиск товаров..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Кнопка фильтров и результаты */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              <span>Фильтры</span>
            </button>
            
            <div className="text-sm text-gray-600">
              Найдено: {filteredAndSortedProducts.length} товаров
            </div>
          </div>
        </div>
      </div>

      {/* Мобильная панель фильтров */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl max-h-96 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Фильтры</h2>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Категории */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Категория
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Все категории</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Цена */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Цена
                  </label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="all">Любая цена</option>
                    <option value="under_1000">До 1 000 ₽</option>
                    <option value="1000_5000">1 000 - 5 000 ₽</option>
                    <option value="5000_20000">5 000 - 20 000 ₽</option>
                    <option value="over_20000">Свыше 20 000 ₽</option>
                  </select>
                </div>

                {/* Сортировка */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Сортировка
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="name">По названию</option>
                    <option value="price_low">Сначала дешёвые</option>
                    <option value="price_high">Сначала дорогие</option>
                    <option value="newest">Сначала новые</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={clearFilters}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Сбросить
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Применить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Основной контент */}
      <div className="px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="medium" text="Загружаем товары..." />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold">Ошибка загрузки</h3>
              <p className="text-gray-600 mt-2 text-sm">{error}</p>
            </div>
            <button
              onClick={refetch}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Попробовать снова
            </button>
          </div>
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Товары не найдены
              </h3>
              <p className="text-gray-500 mb-4 text-sm">
                Попробуйте изменить параметры поиска
              </p>
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Сбросить фильтры
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant="mobile"
                onAddToFavorites={(product) => console.log('Add to favorites:', product)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileProducts;