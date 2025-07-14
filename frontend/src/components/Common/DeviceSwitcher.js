import React, { useState } from 'react';
import { useDevice } from '../../contexts/DeviceContext';

const DeviceSwitcher = () => {
  const { isMobile, isManualMode, switchToMobile, switchToDesktop, switchToAuto } = useDevice();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Кнопка переключателя */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center"
        title="Переключить режим отображения"
      >
        {isMobile ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )}
      </button>

      {/* Панель переключения */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border p-4 min-w-48">
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700 mb-3">Режим отображения</div>
            
            <button
              onClick={() => {
                switchToDesktop();
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
                !isMobile && isManualMode
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Версия для ПК</span>
            </button>

            <button
              onClick={() => {
                switchToMobile();
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
                isMobile && isManualMode
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
              </svg>
              <span>Мобильная версия</span>
            </button>

            <button
              onClick={() => {
                switchToAuto();
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
                !isManualMode
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Автоматически</span>
            </button>
          </div>

          {/* Индикатор текущего режима */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Текущий режим: {isManualMode ? 'Ручной' : 'Авто'} 
              {isMobile ? ' (Мобильный)' : ' (Десктоп)'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceSwitcher;