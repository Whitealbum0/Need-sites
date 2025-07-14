import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import CartIcon from '../Common/CartIcon';
import ContactInfo from '../Common/ContactInfo';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DesktopNavbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.get(`${API}/auth/login`);
      window.location.href = response.data.auth_url;
    } catch (error) {
      console.error('Login redirect error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
              🛍️ Интернет-Магазин
            </a>
          </div>
          
          <div className="flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Главная
            </a>
            <a href="/products" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Каталог товаров
            </a>
            <a href="/categories" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Категории
            </a>
            <a href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              О нас
            </a>
            
            {/* Контакты */}
            <div className="relative">
              <button 
                onClick={() => setIsContactOpen(!isContactOpen)}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Контакты</span>
              </button>
              
              {isContactOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border p-4 z-20">
                  <ContactInfo variant="desktop" />
                </div>
              )}
            </div>
            
            {/* Корзина */}
            <CartIcon onClick={() => window.location.href = '/cart'} />
            
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name}</span>
                  {user.role === 'admin' && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                      Администратор
                    </span>
                  )}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border py-1 z-20">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                    
                    <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Мой профиль
                    </a>
                    <a href="/cart" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Корзина
                    </a>
                    <a href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Мои заказы
                    </a>
                    <a href="/favorites" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Избранное
                    </a>
                    
                    {user.role === 'admin' && (
                      <>
                        <hr className="my-1" />
                        <div className="px-4 py-2 text-xs text-gray-500 font-medium">
                          АДМИНИСТРИРОВАНИЕ
                        </div>
                        <a href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          📊 Панель управления
                        </a>
                        <a href="/admin/products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          📦 Управление товарами
                        </a>
                        <a href="/admin/analytics" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          📈 Аналитика
                        </a>
                        <a href="/admin/users" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          👥 Пользователи
                        </a>
                      </>
                    )}
                    
                    <hr className="my-1" />
                    <button 
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      🚪 Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleLogin}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Войти
                </button>
                <button 
                  onClick={handleLogin}
                  className="border border-blue-600 text-blue-600 px-6 py-2 rounded-md hover:bg-blue-50 transition-colors font-medium"
                >
                  Регистрация
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DesktopNavbar;