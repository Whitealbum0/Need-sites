import React from 'react';

const ContactInfo = ({ variant = 'desktop' }) => {
  const isMobile = variant === 'mobile';
  
  return (
    <div className={`${isMobile ? 'space-y-2' : 'space-y-4'}`}>
      <div className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-gray-900 mb-2`}>
        Свяжитесь с нами
      </div>
      
      <div className="space-y-2">
        <a 
          href="tel:+78001234567" 
          className={`flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors ${isMobile ? 'text-sm' : 'text-base'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>8 (800) 123-45-67</span>
        </a>
        
        <a 
          href="mailto:info@shop.com" 
          className={`flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors ${isMobile ? 'text-sm' : 'text-base'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>info@shop.com</span>
        </a>
        
        <div className={`flex items-center space-x-2 text-gray-600 ${isMobile ? 'text-sm' : 'text-base'}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Работаем 24/7</span>
        </div>
      </div>
      
      <div className={`pt-2 ${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
        Бесплатная доставка от 2000 ₽
      </div>
    </div>
  );
};

export default ContactInfo;