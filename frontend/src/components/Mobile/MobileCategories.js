import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories, useProducts, useCategoryStats } from '../../hooks/useProducts';
import LoadingSpinner from '../Common/LoadingSpinner';

const MobileCategories = () => {
  const navigate = useNavigate();
  const { categories, loading: categoriesLoading } = useCategories();
  const { products } = useProducts();
  const { categoryStats, loading: statsLoading } = useCategoryStats();

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Электроника': '💻',
      'Мода и аксессуары': '👗',
      'Красота и здоровье': '💄',
      'Дом и быт': '🏠',
      'Спорт и фитнес': '⚽'
    };
    return icons[category] || '📦';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Электроника': 'bg-blue-500',
      'Мода и аксессуары': 'bg-purple-500',
      'Красота и здоровье': 'bg-pink-500',
      'Дом и быт': 'bg-green-500',
      'Спорт и фитнес': 'bg-orange-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  if (categoriesLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="medium" text="Загружаем категории..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Мобильный Header */}
      <div className="bg-white shadow-sm border-b sticky top-14 z-30">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Категории товаров
          </h1>
          <p className="text-gray-600 text-center text-sm">
            Выберите категорию для поиска
          </p>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Статистика */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-xl font-bold text-blue-600 mb-1">
              {categories.length}
            </div>
            <div className="text-gray-600 text-xs">Категорий</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-xl font-bold text-green-600 mb-1">
              {products.length}
            </div>
            <div className="text-gray-600 text-xs">Товаров</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-xl font-bold text-purple-600 mb-1">
              {products.length > 0 ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length) : 0} ₽
            </div>
            <div className="text-gray-600 text-xs">Средняя цена</div>
          </div>
        </div>

        {/* Категории */}
        <div className="space-y-4 mb-8">
          {categories.map((category) => {
            const stats = categoryStats[category] || {};
            return (
              <div
                key={category}
                onClick={() => handleCategoryClick(category)}
                className="bg-white rounded-lg shadow-sm p-4 cursor-pointer active:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-lg ${getCategoryColor(category)} flex items-center justify-center text-white text-xl mr-3`}>
                    {getCategoryIcon(category)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {category}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {stats.count || 0} товаров
                      {stats.count > 0 && (
                        <span className="ml-2 text-xs">
                          • от {Math.round(stats.min_price)} ₽
                        </span>
                      )}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        {/* Быстрые фильтры */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Быстрые фильтры
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            <div
              onClick={() => navigate('/products?priceRange=under_1000')}
              className="bg-white rounded-lg shadow-sm p-4 text-center cursor-pointer active:bg-gray-50 transition-colors"
            >
              <div className="text-2xl mb-2">💰</div>
              <h3 className="font-semibold text-gray-900 text-sm">
                До 1 000 ₽
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Доступные товары
              </p>
            </div>

            <div
              onClick={() => navigate('/products?priceRange=1000_5000')}
              className="bg-white rounded-lg shadow-sm p-4 text-center cursor-pointer active:bg-gray-50 transition-colors"
            >
              <div className="text-2xl mb-2">💎</div>
              <h3 className="font-semibold text-gray-900 text-sm">
                1 000 - 5 000 ₽
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Качественные товары
              </p>
            </div>

            <div
              onClick={() => navigate('/products?priceRange=5000_20000')}
              className="bg-white rounded-lg shadow-sm p-4 text-center cursor-pointer active:bg-gray-50 transition-colors"
            >
              <div className="text-2xl mb-2">⭐</div>
              <h3 className="font-semibold text-gray-900 text-sm">
                5 000 - 20 000 ₽
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Премиум товары
              </p>
            </div>

            <div
              onClick={() => navigate('/products?priceRange=over_20000')}
              className="bg-white rounded-lg shadow-sm p-4 text-center cursor-pointer active:bg-gray-50 transition-colors"
            >
              <div className="text-2xl mb-2">👑</div>
              <h3 className="font-semibold text-gray-900 text-sm">
                Свыше 20 000 ₽
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Эксклюзивные товары
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileCategories;