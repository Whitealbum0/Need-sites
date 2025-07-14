import React, { createContext, useContext, useState, useEffect } from 'react';

const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);

  // Определение мобильного устройства
  const detectMobile = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return (
      /android/i.test(userAgent) ||
      (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) ||
      window.innerWidth <= 768
    );
  };

  useEffect(() => {
    // Проверяем сохраненные настройки
    const savedMode = localStorage.getItem('device_mode');
    const savedManual = localStorage.getItem('manual_mode') === 'true';

    if (savedManual && savedMode) {
      setIsManualMode(true);
      setIsMobile(savedMode === 'mobile');
    } else {
      // Автоматическое определение
      setIsMobile(detectMobile());
      setIsManualMode(false);
    }

    // Слушаем изменения размера окна (только для автоматического режима)
    const handleResize = () => {
      if (!isManualMode) {
        setIsMobile(window.innerWidth <= 768);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isManualMode]);

  const switchToMobile = () => {
    setIsMobile(true);
    setIsManualMode(true);
    localStorage.setItem('device_mode', 'mobile');
    localStorage.setItem('manual_mode', 'true');
  };

  const switchToDesktop = () => {
    setIsMobile(false);
    setIsManualMode(true);
    localStorage.setItem('device_mode', 'desktop');
    localStorage.setItem('manual_mode', 'true');
  };

  const switchToAuto = () => {
    setIsManualMode(false);
    setIsMobile(detectMobile());
    localStorage.removeItem('device_mode');
    localStorage.removeItem('manual_mode');
  };

  return (
    <DeviceContext.Provider value={{
      isMobile,
      isManualMode,
      switchToMobile,
      switchToDesktop,
      switchToAuto
    }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};