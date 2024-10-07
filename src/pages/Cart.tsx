import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface CartItem {
  _id: string;
  menuItem: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        if (!token) {
          setError('Please log in to view your cart.');
          setIsLoading(false);
          return;
        }
        const response = await axios.get<CartItem[]>('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCartItems(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching cart items:', err);
        setError('Failed to fetch cart items. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, [token]);

  const updateQuantity = async (id: string, newQuantity: number) => {
    try {
      await axios.put(`http://localhost:5000/api/cart/${id}`, 
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(prevItems =>
        prevItems.map(item =>
          item._id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError('Failed to update quantity. Please try again.');
    }
  };

  const removeItem = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(prevItems => prevItems.filter(item => item._id !== id));
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Failed to remove item. Please try again.');
    }
  };

  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };

  const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  };

  const total = calculateTotal(cartItems);

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h2 className="text-3xl font-bold mb-8">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <li key={item._id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      className="h-16 w-16 rounded-full object-cover" 
                      src={item.menuItem.image} 
                      alt={item.menuItem.name} 
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{item.menuItem.name}</p>
                      <p className="text-sm text-gray-500">{formatPrice(item.menuItem.price)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                    <span className="mx-2 text-gray-700">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="ml-4 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="px-4 py-4 sm:px-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>{formatPrice(total)}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
            <div className="mt-6">
              <Link
                to="/checkout"
                className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-orange-600 hover:bg-orange-700"
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Cart;