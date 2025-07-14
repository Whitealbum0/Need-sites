import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MobileHome = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Слайд-шоу изображения для Hero секции
  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1592839930500-3445eb72b8ad?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBzaG9wcGluZ3xlbnwwfHx8Ymx1ZXwxNzUyNDg0Nzk5fDA&ixlib=rb-4.1.0&q=85",
      title: "Онлайн покупки",
      subtitle: "Удобные покупки из дома"
    },
    {
      url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
      title: "Модная одежда",
      subtitle: "Стильные образы каждый день"
    },
    {
      url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
      title: "Электроника",
      subtitle: "Новейшие технологии"
    },
    {
      url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
      title: "Косметика",
      subtitle: "Красота и уход"
    },
    {
      url: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
      title: "Дом и интерьер", 
      subtitle: "Уютный дом мечты"
    }
  ];

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  // Автоматическое переключение слайдов каждые 4 секунды
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setFeaturedProducts(response.data.slice(0, 6));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Обработка свайпов на мобильных устройствах
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Мобильный Hero Section с пролистываемым слайд-шоу */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative px-4 py-8">
          <div className="text-center space-y-4 mb-6">
            <h1 className="text-3xl font-bold leading-tight">
              Современный
              <br />
              <span className="text-yellow-300">Интернет-Магазин</span>
            </h1>
            <p className="text-lg text-blue-100 leading-relaxed px-4">
              Качественные товары, быстрая доставка, надёжный сервис
            </p>
            
            <div className="space-y-3 pt-4">
              <a 
                href="/products" 
                className="block bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold mx-4 text-center shadow-lg"
              >
                🛍️ Посмотреть товары
              </a>
              <a 
                href="#features" 
                className="block border-2 border-white text-white px-6 py-3 rounded-xl font-semibold mx-4 text-center"
              >
                📖 Узнать больше
              </a>
            </div>

            <div className="flex justify-center space-x-8 pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">1000+</div>
                <div className="text-blue-200 text-sm">Товаров</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-blue-200 text-sm">Категорий</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-blue-200 text-sm">Поддержка</div>
              </div>
            </div>
          </div>
          
          {/* Пролистываемое слайд-шоу */}
          <div className="relative">
            <div 
              className="relative overflow-hidden rounded-xl shadow-2xl mx-4"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {heroImages.map((image, index) => (
                  <div key={index} className="w-full flex-shrink-0 relative">
                    <img 
                      src={image.url}
                      alt={image.title}
                      className="w-full h-48 object-cover"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-lg font-bold">{image.title}</h3>
                      <p className="text-sm text-gray-200">{image.subtitle}</p>
                    </div>
                    
                    {/* Индикатор загрузки для текущего слайда */}
                    {index === currentSlide && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                          <span className="text-white text-xs font-medium">
                            {index + 1} / {heroImages.length}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Навигационные кнопки */}
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all z-10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all z-10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Подсказка для свайпа (показывается только на первом слайде) */}
              {currentSlide === 0 && (
                <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 animate-bounce">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white text-xs">👈 Пролистывайте пальцем 👉</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Индикаторы слайдов */}
            <div className="flex justify-center mt-4 space-x-2">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white scale-125' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Быстрые категории для мобильных */}
      <div className="py-8 bg-white">
        <div className="px-4">
          <h2 className="text-2xl font-bold text-center mb-6">Категории</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/products?category=electronics" className="bg-blue-50 p-4 rounded-xl text-center hover:bg-blue-100 transition-colors">
              <div className="text-3xl mb-2">📱</div>
              <div className="font-semibold text-blue-700">Электроника</div>
            </a>
            <a href="/products?category=beauty" className="bg-pink-50 p-4 rounded-xl text-center hover:bg-pink-100 transition-colors">
              <div className="text-3xl mb-2">💄</div>
              <div className="font-semibold text-pink-700">Красота</div>
            </a>
            <a href="/products?category=clothing" className="bg-green-50 p-4 rounded-xl text-center hover:bg-green-100 transition-colors">
              <div className="text-3xl mb-2">👕</div>
              <div className="font-semibold text-green-700">Одежда</div>
            </a>
            <a href="/products?category=home" className="bg-orange-50 p-4 rounded-xl text-center hover:bg-orange-100 transition-colors">
              <div className="text-3xl mb-2">🏠</div>
              <div className="font-semibold text-orange-700">Дом</div>
            </a>
          </div>
        </div>
      </div>

      {/* Мобильные Features */}
      <div id="features" className="py-12 bg-gray-50">
        <div className="px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Почему выбирают нас?
            </h2>
            <p className="text-gray-600">
              Лучший сервис для наших клиентов
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 rounded-xl w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Быстрая доставка</h3>
                  <p className="text-gray-600 text-sm">Доставляем товары в кратчайшие сроки по всей стране</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 rounded-xl w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Качественные товары</h3>
                  <p className="text-gray-600 text-sm">Только проверенные товары от надёжных поставщиков</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 rounded-xl w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 110 19.5 9.75 9.75 0 010-19.5zM8.25 8.25h7.5v7.5h-7.5v-7.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Поддержка 24/7</h3>
                  <p className="text-gray-600 text-sm">Круглосуточная поддержка для решения любых вопросов</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Мобильная витрина товаров */}
      <div className="py-12 bg-white">
        <div className="px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Популярные товары
            </h2>
            <p className="text-gray-600">
              Лучшие предложения для вас
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="space-y-4">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
                        {product.description}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-lg font-bold text-blue-600">
                            {product.price.toLocaleString()} ₽
                          </span>
                          <div className="text-xs text-gray-500">
                            {product.category}
                          </div>
                        </div>
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
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Товары скоро появятся</p>
            </div>
          )}
          
          <div className="text-center mt-8">
            <a 
              href="/products" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Посмотреть все товары
            </a>
          </div>
        </div>
      </div>

      {/* Мобильный призыв к действию */}
      <div className="py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Готовы начать покупки?
          </h2>
          <p className="text-blue-100 mb-6">
            Присоединяйтесь к тысячам довольных клиентов
          </p>
          <a 
            href="/products" 
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Начать покупки
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobileHome;