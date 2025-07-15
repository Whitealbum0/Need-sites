import React, { useState } from 'react';
import { useAuth } from '../../contexts/OAuth2AuthContext';
import { useCart } from '../../contexts/CartContext';
import CartIcon from '../Common/CartIcon';
import ContactInfo from '../Common/ContactInfo';
import GoogleLoginButton from '../Auth/GoogleLoginButton';

const DesktopNavbarOAuth2 = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Логотип */}
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-blue-600">
              🛍️ Интернет-Магазин
            </a>
          </div>
          
          {/* Навигация */}
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
            
            {/* Авторизация */}
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm overflow-hidden">
                    {user.picture ? (
                      <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
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
                      <div className="text-xs text-gray-400 mt-1">
                        Вход через: {user.provider || 'Google'}
                      </div>
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
                    
                    {user.role === 'admin' && (
                      <>
                        <div className="border-t border-gray-200 my-1"></div>
                        <a href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Админ панель
                        </a>
                        <a href="/admin/users" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Пользователи
                        </a>
                        <a href="/admin/analytics" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Аналитика
                        </a>
                      </>
                    )}
                    
                    <div className="border-t border-gray-200 my-1"></div>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Войти
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Модальное окно авторизации */}
      {isLoginOpen && (
        <GoogleLoginButton onClose={() => setIsLoginOpen(false)} />
      )}
    </nav>
  );
};

export default DesktopNavbarOAuth2;