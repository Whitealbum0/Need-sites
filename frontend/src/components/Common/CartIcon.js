import React from 'react';
import { useCart } from '../../contexts/CartContext';

const CartIcon = ({ onClick, className = '' }) => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <button
      onClick={onClick}
      className={`relative p-2 hover:bg-gray-100 rounded-lg transition-colors ${className}`}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5A2 2 0 007.83 20H16a2 2 0 001.95-1.55L19 13M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
      </svg>
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
};

export default CartIcon;