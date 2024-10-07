import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Plus } from 'lucide-react';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

const Menu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get<MenuItem[]>('http://localhost:5000/api/menu');
        setMenuItems(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch menu items. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const addToCart = async (menuItemId: string) => {
    try {
      await axios.post('http://localhost:5000/api/cart', { menuItemId, quantity: 1 });
      // You might want to show a success message or update the cart count here
    } catch (err) {
      setError('Failed to add item to cart. Please try again.');
    }
  };

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
    >
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Our Menu</h2>
      {menuItems.length === 0 ? (
        <p className="text-center text-gray-600">No menu items available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item) => (
            <motion.div
              key={item._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img src={item.image} alt={item.name} className="w-full h-72 object-cover "  />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{item.name}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-orange-500">${item.price.toFixed(2)}</span>
                  <button
                    onClick={() => addToCart(item._id)}
                    className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition duration-300"
                  >
                    <Plus className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Menu;