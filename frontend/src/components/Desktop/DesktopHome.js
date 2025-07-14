import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DesktopHome = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  // Слайд-шоу изображения для Hero секции на десктопе
  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1592839930500-3445eb72b8ad?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBzaG9wcGluZ3xlbnwwfHx8Ymx1ZXwxNzUyNDg0Nzk5fDA&ixlib=rb-4.1.0&q=85",
      title: "Премиум онлайн-шопинг",
      subtitle: "Откройте мир роскошных покупок"
    },
    {
      url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
      title: "Стильная мода",
      subtitle: "Эксклюзивные коллекции от ведущих брендов"
    },
    {
      url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
      title: "Инновационная электроника",
      subtitle: "Последние технологические новинки"
    },
    {
      url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
      title: "Премиум косметика",
      subtitle: "Профессиональные средства для красоты"
    },
    {
      url: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
      title: "Дизайн интерьера",
      subtitle: "Создайте дом своей мечты"
    },
    {
      url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
      title: "Спорт и фитнес",
      subtitle: "Всё для активного образа жизни"
    }
  ];

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    if (featuredProducts.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [featuredProducts]);

  // Автоматическое переключение Hero слайдов каждые 6 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setFeaturedProducts(response.data.slice(0, 8));
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

  // Функции для управления Hero слайд-шоу
  const nextHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const goToHeroSlide = (index) => {
    setCurrentHeroSlide(index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Расширенный Hero Section для десктопа с пролистываемым слайд-шоу */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 z-10">
              <div>
                <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                  Премиум
                  <span className="block text-yellow-300">Интернет-Магазин</span>
                </h1>
                <p className="text-xl lg:text-2xl mb-8 text-blue-100 leading-relaxed">
                  Откройте мир эксклюзивных товаров. Качество, стиль и инновации в каждом продукте. 
                  Доставка по всей России, гарантия качества, премиум сервис.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/products" 
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 text-center text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  🛍️ Перейти к покупкам
                </a>
                <a 
                  href="#features" 
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 text-center text-lg"
                >
                  📖 Узнать больше
                </a>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">1000+</div>
                  <div className="text-blue-200 text-sm">Товаров</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">50+</div>
                  <div className="text-blue-200 text-sm">Категорий</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">24/7</div>
                  <div className="text-blue-200 text-sm">Поддержка</div>
                </div>
              </div>
            </div>
            
            {/* Десктопное Hero слайд-шоу */}
            <div className="relative z-10">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <div 
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentHeroSlide * 100}%)` }}
                >
                  {heroImages.map((image, index) => (
                    <div key={index} className="w-full flex-shrink-0 relative">
                      <img 
                        src={image.url}
                        alt={image.title}
                        className="w-full h-96 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                      
                      {/* Информация о слайде */}
                      <div className="absolute bottom-6 left-6 text-white">
                        <h3 className="text-2xl font-bold mb-2">{image.title}</h3>
                        <p className="text-lg text-gray-200">{image.subtitle}</p>
                      </div>
                      
                      {/* Индикатор номера слайда */}
                      <div className="absolute top-6 right-6">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                          <span className="text-white font-semibold">
                            {index + 1} / {heroImages.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Навигационные кнопки для Hero слайд-шоу */}
                <button
                  onClick={prevHeroSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 z-20"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={nextHeroSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 z-20"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* Индикаторы Hero слайдов */}
              <div className="flex justify-center mt-6 space-x-3">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToHeroSlide(index)}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      index === currentHeroSlide 
                        ? 'bg-white scale-125 shadow-lg' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
              
              {/* Прогресс-бар автоматического переключения */}
              <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-white h-full transition-all duration-6000 ease-linear"
                  style={{ 
                    width: `${((currentHeroSlide + 1) / heroImages.length) * 100}%`,
                    animation: 'progress 6s linear infinite'
                  }}
                />
              </div>
            </div>
            
            {/* Декоративные элементы */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
            <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Расширенный Features Section */}
      <div id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Почему клиенты выбирают нас?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Мы создали экосистему премиум-сервиса, где каждая деталь имеет значение
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Экспресс доставка</h3>
              <p className="text-gray-600 leading-relaxed">Доставка в день заказа по Москве и СПб. По России - за 1-3 дня</p>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Премиум качество</h3>
              <p className="text-gray-600 leading-relaxed">Каждый товар проходит строгий контроль качества. Гарантия возврата 30 дней</p>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 110 19.5 9.75 9.75 0 010-19.5zM8.25 8.25h7.5v7.5h-7.5v-7.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Поддержка 24/7</h3>
              <p className="text-gray-600 leading-relaxed">Персональный менеджер поможет с выбором товара в любое время</p>
            </div>

            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Выгодные цены</h3>
              <p className="text-gray-600 leading-relaxed">Прямые поставки от производителей. Скидки для постоянных клиентов</p>
            </div>
          </div>
        </div>
      </div>

      {/* Продвинутый Products Slideshow для десктопа */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Эксклюзивная коллекция
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Откройте для себя тщательно отобранные товары премиум-класса
            </p>
          </div>
          
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="relative">
              {/* Desktop Advanced Slideshow */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <div 
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 25}%)` }}
                >
                  {featuredProducts.map((product, index) => (
                    <div key={product.id} className="w-1/4 flex-shrink-0 px-3">
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                        {product.images && product.images.length > 0 ? (
                          <div className="relative overflow-hidden">
                            <img 
                              src={`data:image/jpeg;base64,${product.images[0]}`}
                              alt={product.name}
                              className="w-full h-72 object-cover transition-transform duration-300 hover:scale-110"
                            />
                            <div className="absolute top-4 right-4">
                              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                ХИТ
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-72 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <div className="text-center">
                              <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="text-gray-400">Нет изображения</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="p-6">
                          <h3 className="text-xl font-semibold mb-3 line-clamp-2">{product.name}</h3>
                          <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">{product.description}</p>
                          
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <span className="text-2xl font-bold text-blue-600">
                                {product.price.toLocaleString()} ₽
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
                          
                          <a 
                            href={`/products/${product.id}`}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-center block shadow-lg hover:shadow-xl"
                          >
                            Подробнее
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Улучшенные Navigation Buttons */}
                <button
                  onClick={prevSlide}
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={nextSlide}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* Enhanced Slide Indicators */}
              <div className="flex justify-center mt-8 space-x-3">
                {featuredProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-blue-600 scale-125' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-500 text-xl">Товары скоро появятся</div>
            </div>
          )}
          
          <div className="text-center mt-12">
            <a 
              href="/products" 
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span>Посмотреть весь каталог</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopHome;