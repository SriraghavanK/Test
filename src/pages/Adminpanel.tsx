import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface OrderItem {
  menuItem: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
}

const AdminPanel: React.FC = () => {
  const { token } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [newItem, setNewItem] = useState({ name: '', description: '', price: 0, image: '', category: '' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMenuItems();
    fetchOrders();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get<MenuItem[]>('http://localhost:5000/api/menu');
      setMenuItems(response.data);
    } catch (error) {
      setError('Error fetching menu items: ' + getErrorMessage(error));
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get<Order[]>('http://localhost:5000/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Error fetching orders: ' + getErrorMessage(error));
    }
  };

  const addMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/menu', newItem, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewItem({ name: '', description: '', price: 0, image: '', category: '' });
      fetchMenuItems();
    } catch (error) {
      setError('Error adding menu item: ' + getErrorMessage(error));
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/orders/${orderId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders();
    } catch (error) {
      setError('Error updating order status: ' + getErrorMessage(error));
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchOrders();
      } catch (error) {
        setError('Error deleting order: ' + getErrorMessage(error));
      }
    }
  };

  const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message || error.message;
    }
    return 'An unexpected error occurred';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Add New Menu Item</h2>
        <form onSubmit={addMenuItem} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newItem.image}
            onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Add Item
          </button>
        </form>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Menu Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <div key={item._id} className="border p-4 rounded">
              <h3 className="font-bold">{item.name}</h3>
              <p>{item.description}</p>
              <p>Price: ${item.price.toFixed(2)}</p>
              <p>Category: {item.category}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Orders</h2>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded">
              <p>Order ID: {order._id}</p>
              <p>User: {order.user?.name || 'Unknown'} ({order.user?.email || 'No email'})</p>
              <p>Total: ${order.total.toFixed(2)}</p>
              <p>Status: {order.status}</p>
              <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
              <ul className="mt-2">
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.menuItem?.name || 'Unknown item'} x {item.quantity} - ${((item.menuItem?.price || 0) * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                className="mt-2 p-2 border rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Preparing">Preparing</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
              <button
                onClick={() => deleteOrder(order._id)}
                className="bg-red-500 text-white px-4 py-2 mt-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;