import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-12 text-center"
    >
      <h1 className="text-5xl font-bold mb-6 text-gray-800">Welcome to Our Food Ordering App</h1>
      <p className="text-2xl mb-8 text-gray-600">Delicious food, delivered to your doorstep</p>
      <div className="flex justify-center space-x-4 mb-12">
        <Link
          to="/menu"
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 shadow-md text-lg"
        >
          View Menu
        </Link>
        {!user && (
          <Link
            to="/register"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-full transition duration-300 shadow-md text-lg"
          >
            Sign Up
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-orange-500">Wide Selection</h2>
          <p className="text-gray-600">Choose from a variety of cuisines and dishes to satisfy any craving.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-orange-500">Fast Delivery</h2>
          <p className="text-gray-600">Get your food delivered hot and fresh in no time.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-orange-500">Easy Ordering</h2>
          <p className="text-gray-600">Order with just a few clicks and track your delivery in real-time.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;