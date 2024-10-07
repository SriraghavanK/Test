import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface MenuItem {
  _id: string;
  name: string;
  price: number;
}

interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
}

export default function Profile() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get<Order[]>('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to fetch orders. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (!user) {
    return <div className="text-center py-12">Please log in to view your profile.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
          <p className="text-gray-600">{user.name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <p className="text-gray-600">{user.email}</p>
        </div>
        {user.address && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Address:</label>
            <p className="text-gray-600">{user.address}</p>
          </div>
        )}
        {user.phone && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Phone:</label>
            <p className="text-gray-600">{user.phone}</p>
          </div>
        )}
        {user.isAdmin && (
          <div className="mb-4">
            <span className="text-green-600 font-bold">You are an Admin.</span>
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      {isLoading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white shadow-md rounded-lg p-6">
              <p className="font-bold">Order ID: {order._id}</p>
              <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
              <p>Status: {order.status}</p>
              <p>Total: ${order.total.toFixed(2)}</p>
              <ul className="mt-2">
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.menuItem && item.menuItem.name ? (
                      <>
                        {item.menuItem.name} x {item.quantity} - ${((item.menuItem.price || 0) * item.quantity).toFixed(2)}
                      </>
                    ) : (
                      <span>Item information unavailable</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}