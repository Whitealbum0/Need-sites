import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories, useProducts, useCategoryStats } from '../../hooks/useProducts';
import LoadingSpinner from '../Common/LoadingSpinner';

const DesktopCategories = () => {
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
        <LoadingSpinner size="large" text="Загружаем категории..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Категории товаров
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Выберите категорию, чтобы найти именно то, что вам нужно
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {categories.length}
            </div>
            <div className="text-gray-600">Категорий товаров</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {products.length}
            </div>
            <div className="text-gray-600">Всего товаров</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {products.length > 0 ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length) : 0} ₽
            </div>
            <div className="text-gray-600">Средняя цена</div>
          </div>
        </div>

        {/* Категории */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const stats = categoryStats[category] || {};
            return (
              <div
                key={category}
                onClick={() => handleCategoryClick(category)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer group"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 rounded-lg ${getCategoryColor(category)} flex items-center justify-center text-white text-2xl mr-4`}>
                      {getCategoryIcon(category)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {category}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {stats.count || 0} товаров
                      </p>
                    </div>
                  </div>

                  {stats.count > 0 && (
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Цена от:</span>
                        <span className="font-medium">{Math.round(stats.min_price)} ₽</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Цена до:</span>
                        <span className="font-medium">{Math.round(stats.max_price)} ₽</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Средняя цена:</span>
                        <span className="font-medium">{Math.round(stats.avg_price)} ₽</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm group-hover:underline">
                      Посмотреть товары
                    </button>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Быстрые фильтры */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Быстрые фильтры
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              onClick={() => navigate('/products?priceRange=under_1000')}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer p-6 text-center group"
            >
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                До 1 000 ₽
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Доступные товары
              </p>
            </div>

            <div
              onClick={() => navigate('/products?priceRange=1000_5000')}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer p-6 text-center group"
            >
              <div className="text-3xl mb-3">💎</div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                1 000 - 5 000 ₽
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Качественные товары
              </p>
            </div>

            <div
              onClick={() => navigate('/products?priceRange=5000_20000')}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer p-6 text-center group"
            >
              <div className="text-3xl mb-3">⭐</div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                5 000 - 20 000 ₽
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Премиум товары
              </p>
            </div>

            <div
              onClick={() => navigate('/products?priceRange=over_20000')}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer p-6 text-center group"
            >
              <div className="text-3xl mb-3">👑</div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                Свыше 20 000 ₽
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Эксклюзивные товары
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopCategories;