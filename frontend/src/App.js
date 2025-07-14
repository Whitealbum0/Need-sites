import React, { useState, useEffect, createContext, useContext } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('session_token');
    if (token) {
      checkAuthStatus(token);
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async (token) => {
    try {
      const response = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('session_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (sessionId) => {
    try {
      const response = await axios.post(`${API}/auth/session`, {
        session_id: sessionId
      });
      
      const { user, session_token } = response.data;
      localStorage.setItem('session_token', session_token);
      setUser(user);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('session_token');
      if (token) {
        await axios.post(`${API}/auth/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('session_token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Components
const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.get(`${API}/auth/login`);
      window.location.href = response.data.auth_url;
    } catch (error) {
      console.error('Login redirect error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-blue-600">
              Магазин
            </a>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <a href="/" className="text-gray-700 hover:text-blue-600">Главная</a>
            <a href="/products" className="text-gray-700 hover:text-blue-600">Товары</a>
            
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                >
                  <span>{user.name}</span>
                  {user.role === 'admin' && (
                    <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                      Админ
                    </span>
                  )}
                </button>
                
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    {user.role === 'admin' && (
                      <>
                        <a href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                          Админ панель
                        </a>
                        <a href="/admin/products" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                          Управление товарами
                        </a>
                        <a href="/admin/analytics" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                          Аналитика
                        </a>
                      </>
                    )}
                    <button 
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Войти
              </button>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="/" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Главная</a>
              <a href="/products" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Товары</a>
              
              {user ? (
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex items-center px-3 py-2">
                    <span className="text-gray-700">{user.name}</span>
                    {user.role === 'admin' && (
                      <span className="ml-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                        Админ
                      </span>
                    )}
                  </div>
                  
                  {user.role === 'admin' && (
                    <>
                      <a href="/admin" className="block px-3 py-2 text-gray-700 hover:bg-gray-100">
                        Админ панель
                      </a>
                      <a href="/admin/products" className="block px-3 py-2 text-gray-700 hover:bg-gray-100">
                        Управление товарами
                      </a>
                      <a href="/admin/analytics" className="block px-3 py-2 text-gray-700 hover:bg-gray-100">
                        Аналитика
                      </a>
                    </>
                  )}
                  
                  <button 
                    onClick={logout}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Выйти
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleLogin}
                  className="block w-full text-left px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Войти
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    if (featuredProducts.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
      }, 4000); // Автоматическая прокрутка каждые 4 секунды

      return () => clearInterval(interval);
    }
  }, [featuredProducts]);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setFeaturedProducts(response.data.slice(0, 6)); // Увеличиваем до 6 товаров для слайд-шоу
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Современный интернет-магазин
              </h1>
              <p className="text-xl mb-8">
                Найдите всё, что вам нужно, в одном месте. Качественные товары, быстрая доставка, надёжный сервис.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/products" 
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
                >
                  Посмотреть товары
                </a>
                <a 
                  href="#features" 
                  className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-center"
                >
                  Узнать больше
                </a>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1592839930500-3445eb72b8ad?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBzaG9wcGluZ3xlbnwwfHx8Ymx1ZXwxNzUyNDg0Nzk5fDA&ixlib=rb-4.1.0&q=85"
                alt="Онлайн покупки"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Почему выбирают нас?
            </h2>
            <p className="text-gray-600 text-lg">
              Мы предлагаем лучший сервис для наших клиентов
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Быстрая доставка</h3>
              <p className="text-gray-600">Доставляем товары в кратчайшие сроки по всей стране</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Качественные товары</h3>
              <p className="text-gray-600">Только проверенные и качественные товары от надёжных поставщиков</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 110 19.5 9.75 9.75 0 010-19.5zM8.25 8.25h7.5v7.5h-7.5v-7.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Поддержка 24/7</h3>
              <p className="text-gray-600">Круглосуточная поддержка клиентов для решения любых вопросов</p>
            </div>
          </div>
        </div>
      </div>