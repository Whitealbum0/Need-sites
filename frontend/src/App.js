import React, { Suspense } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

// Контексты
import { AuthProvider } from './contexts/AuthContext';
import { DeviceProvider, useDevice } from './contexts/DeviceContext';
import { CartProvider } from './contexts/CartContext';

// Общие компоненты
import DeviceSwitcher from './components/Common/DeviceSwitcher';
import LoadingSpinner from './components/Common/LoadingSpinner';

// Lazy loading компонентов для code splitting
const DesktopNavbar = React.lazy(() => import('./components/Desktop/DesktopNavbar'));
const DesktopHome = React.lazy(() => import('./components/Desktop/DesktopHome'));
const DesktopProducts = React.lazy(() => import('./components/Desktop/DesktopProducts'));
const DesktopCategories = React.lazy(() => import('./components/Desktop/DesktopCategories'));
const DesktopCart = React.lazy(() => import('./components/Desktop/DesktopCart'));

const MobileNavbar = React.lazy(() => import('./components/Mobile/MobileNavbar'));
const MobileHome = React.lazy(() => import('./components/Mobile/MobileHome'));
const MobileProducts = React.lazy(() => import('./components/Mobile/MobileProducts'));
const MobileCategories = React.lazy(() => import('./components/Mobile/MobileCategories'));
const MobileCart = React.lazy(() => import('./components/Mobile/MobileCart'));

// Создаем клиент для React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 минут
      cacheTime: 10 * 60 * 1000, // 10 минут
      refetchOnWindowFocus: false,
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

// Главный компонент приложения
const AppContent = () => {
  const { isMobile } = useDevice();

  // Определяем какие компоненты использовать
  const Navbar = isMobile ? MobileNavbar : DesktopNavbar;
  const Home = isMobile ? MobileHome : DesktopHome;
  const Products = isMobile ? MobileProducts : DesktopProducts;
  const Categories = isMobile ? MobileCategories : DesktopCategories;
  const Cart = isMobile ? MobileCart : DesktopCart;

  return (
    <div className="App">
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner size="large" text="Загрузка..." />}>
          <Navbar />
        </Suspense>
        <Routes>
          <Route path="/" element={
            <Suspense fallback={<LoadingSpinner size="large" text="Загрузка главной страницы..." />}>
              <Home />
            </Suspense>
          } />
          <Route path="/products" element={
            <Suspense fallback={<LoadingSpinner size="large" text="Загрузка каталога..." />}>
              <Products />
            </Suspense>
          } />
          <Route path="/categories" element={
            <Suspense fallback={<LoadingSpinner size="large" text="Загрузка категорий..." />}>
              <Categories />
            </Suspense>
          } />
          <Route path="/cart" element={
            <Suspense fallback={<LoadingSpinner size="large" text="Загрузка корзины..." />}>
              <Cart />
            </Suspense>
          } />
          <Route path="/products/:id" element={
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Детали товара</h1>
              <p className="text-gray-600">
                {isMobile ? 'Мобильная' : 'Десктопная'} версия страницы товара в разработке
              </p>
            </div>
          } />
          <Route path="/admin" element={
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Админ панель</h1>
              <p className="text-gray-600">
                {isMobile ? 'Мобильная' : 'Десктопная'} версия админ панели в разработке
              </p>
            </div>
          } />
          <Route path="/admin/products" element={
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Управление товарами</h1>
              <p className="text-gray-600">
                {isMobile ? 'Мобильная' : 'Десктопная'} версия управления товарами в разработке
              </p>
            </div>
          } />
          <Route path="/admin/analytics" element={
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Аналитика</h1>
              <p className="text-gray-600">
                {isMobile ? 'Мобильная' : 'Десктопная'} версия аналитики в разработке
              </p>
            </div>
          } />
          <Route path="/profile" element={
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Обработка входа...</h1>
              <p className="text-gray-600">Пожалуйста, подождите</p>
            </div>
          } />
          <Route path="/about" element={
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">О нас</h1>
              <p className="text-gray-600">
                {isMobile ? 'Мобильная' : 'Десктопная'} версия страницы "О нас" в разработке
              </p>
            </div>
          } />
        </Routes>
        
        {/* Переключатель режимов */}
        <DeviceSwitcher />
      </BrowserRouter>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DeviceProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </DeviceProvider>
      </AuthProvider>
      {/* React Query DevTools только в development */}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;