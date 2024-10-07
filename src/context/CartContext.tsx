// CartContext.tsx
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = async (item: CartItem) => {
    try {
      await axios.post('http://localhost:5000/api/cart', { ...item, quantity: 1 });
      setCartItems(prev => [...prev, item]);
    } catch (err) {
      console.error('Failed to add item to cart:', err);
    }
  };

  const updateQuantity = async (id: string, newQuantity: number) => {
    try {
      await axios.put(`/api/cart/${id}`, { quantity: newQuantity });
      setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    } catch (err) {
      console.error('Failed to update item quantity:', err);
    }
  };

  const removeItem = async (id: string) => {
    try {
      await axios.delete(`/api/cart/${id}`);
      setCartItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Failed to remove item from cart:', err);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
