import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { formatPrice } from '../../utils/helpers';
import CartButton from '../Common/CartButton';
import ContactInfo from '../Common/ContactInfo';

const MobileCart = () => {
  const { items, getTotalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b sticky top-14 z-30">
          <div className="px-4 py-6">
            <h1 className="text-2xl font-bold text-gray-900 text-center">
              Корзина
            </h1>
          </div>
        </div>

        <div className="px-4 py-16">
          <div className="text-center">
            <div className="text-gray-400 mb-6">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5A2 2 0 007.83 20H16a2 2 0 001.95-1.55L19 13M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Корзина пуста
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
              Добавьте товары в корзину, чтобы оформить заказ
            </p>
            <a 
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5A2 2 0 007.83 20H16a2 2 0 001.95-1.55L19 13M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
              </svg>
              Перейти к покупкам
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b sticky top-14 z-30">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Корзина
          </h1>
          <p className="text-center text-gray-600 text-sm">
            {items.length} товара на сумму {formatPrice(getTotalPrice())}
          </p>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Товары в корзине */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Товары в корзине
            </h2>
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Очистить
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg">
                    {item.images && item.images.length > 0 ? (
                      <img 
                        src={`data:image/jpeg;base64,${item.images[0]}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {item.category}
                    </p>
                    <div className="text-sm font-bold text-gray-900 mt-1">
                      {formatPrice(item.price)}
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <CartButton product={item} variant="secondary" />
                    <div className="text-xs text-gray-600">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Итого */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Итого
          </h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Товары:</span>
              <span className="font-medium">{formatPrice(getTotalPrice())}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Доставка:</span>
              <span className="font-medium text-green-600">Бесплатно</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between text-base font-bold">
                <span>Итого:</span>
                <span>{formatPrice(getTotalPrice())}</span>
              </div>
            </div>
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-3">
            Оформить заказ
          </button>

          <div className="text-xs text-gray-500 text-center">
            Нажимая "Оформить заказ", вы соглашаетесь с условиями оферты
          </div>
        </div>

        {/* Контактная информация */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <ContactInfo variant="mobile" />
        </div>
      </div>
    </div>
  );
};

export default MobileCart;