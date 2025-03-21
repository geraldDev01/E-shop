'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/context/auth/AuthContext';
import { getCart } from '@/api/cart';

interface CartContextType {
  cartItemsCount: string;
  updateCartCount: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItemsCount, setCartItemsCount] = useState("0");
  const { user, isAuthenticated } = useAuth();

  const updateCartCount = async () => {
    if (!isAuthenticated || !user) {
      setCartItemsCount("0");
      return;
    }

    try {
      const result = await getCart(user.token);
      if (result.success && result.data) {
        setCartItemsCount(result.data.total_items);
      }
    } catch (error) {
      console.error('Error updating cart count:', error);
    }
  };

  useEffect(() => {
    updateCartCount();
  }, [isAuthenticated,updateCartCount, user]);

  return (
    <CartContext.Provider value={{ cartItemsCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 