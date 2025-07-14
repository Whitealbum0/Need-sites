import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Контексты
import { AuthProvider } from './contexts/AuthContext';
import { DeviceProvider, useDevice } from './contexts/DeviceContext';

// Общие компоненты
import DeviceSwitcher from './components/Common/DeviceSwitcher';

// Десктопные компоненты
import DesktopNavbar from './components/Desktop/DesktopNavbar';
import DesktopHome from './components/Desktop/DesktopHome';
import DesktopProducts from './components/Desktop/DesktopProducts';

// Мобильные компоненты
import MobileNavbar from './components/Mobile/MobileNavbar';
import MobileHome from './components/Mobile/MobileHome';
import MobileProducts from './components/Mobile/MobileProducts';

// Главный компонент приложения
const AppContent = () => {
  const { isMobile } = useDevice();

  // Определяем какие компоненты использовать
  const Navbar = isMobile ? MobileNavbar : DesktopNavbar;
  const Home = isMobile ? MobileHome : DesktopHome;

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Каталог товаров</h1>
              <p className="text-gray-600">
                {isMobile ? 'Мобильная' : 'Десктопная'} версия каталога в разработке
              </p>
            </div>
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
          <Route path="/categories" element={
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Категории</h1>
              <p className="text-gray-600">
                {isMobile ? 'Мобильная' : 'Десктопная'} версия категорий в разработке
              </p>
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
    <AuthProvider>
      <DeviceProvider>
        <AppContent />
      </DeviceProvider>
    </AuthProvider>
  );
}

export default App;