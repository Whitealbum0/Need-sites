import React from 'react';
import { useCart } from '../../contexts/CartContext';

const CartButton = ({ product, variant = 'primary' }) => {
  const { addItem, getItemQuantity, updateQuantity } = useCart();
  const quantity = getItemQuantity(product.id);

  const handleAddToCart = () => {
    addItem(product);
  };

  const handleIncrement = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      updateQuantity(product.id, 0);
    }
  };

  if (quantity === 0) {
    return (
      <button
        onClick={handleAddToCart}
        className={`
          ${variant === 'primary' 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'bg-white hover:bg-gray-50 text-blue-600 border border-blue-600'
          }
          px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2
        `}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5A2 2 0 007.83 20H16a2 2 0 001.95-1.55L19 13M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6M12 10v4m-2-2h4" />
        </svg>
        <span>В корзину</span>
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleDecrement}
        className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      
      <span className="w-8 text-center font-medium">{quantity}</span>
      
      <button
        onClick={handleIncrement}
        className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default CartButton;