import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51BTUDGJAJfZb9HEBwDg86TN1KNprHjkfipXmEDMb0gSCassK5T3ZfxsAbcgKVmAIXF7oZ6ItlZZbXO6idTHE67IM007EwQ4uN3');

const CheckoutForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { token } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    if (cardElement) {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setError(error.message || 'An error occurred');
        setIsProcessing(false);
      } else {
        try {
          const response = await axios.post(
            'http://localhost:5000/api/payments',
            { paymentMethodId: paymentMethod.id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (response.data.success) {
            onSuccess();
          } else {
            throw new Error(response.data.message || 'Payment failed');
          }
        } catch (err) {
          setError('Payment failed. Please try again.');
          console.error('Payment error:', err);
        } finally {
          setIsProcessing(false);
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={{
        style: {
          base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
              color: '#aab7c4',
            },
          },
          invalid: {
            color: '#9e2146',
          },
        },
        hidePostalCode: true,
      }} />
      {error && <div className="text-red-500 mt-2">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="mt-4 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

const Checkout: React.FC = () => {
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, token } = useAuth();

  useEffect(() => {
    if (user && user.address) {
      setAddress(user.address);
    }
  }, [user]);

  const handlePaymentSuccess = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/orders', 
        { address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Order placed successfully:', response.data);
      navigate('/order-tracking');
    } catch (err) {
      console.error('Checkout error:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(`Failed to place order: ${err.response.data.message}`);
      } else {
        setError('Failed to place order. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center py-12">Please log in to checkout.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h2 className="text-3xl font-bold mb-8 text-center">Checkout</h2>
      <div className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
            Delivery Address
          </label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={3}
            required
          />
        </div>
        <Elements stripe={stripePromise}>
          <CheckoutForm onSuccess={handlePaymentSuccess} />
        </Elements>
        {error && <p className="text-red-500 text-sm italic mt-4">{error}</p>}
      </div>
    </motion.div>
  );
};

export default Checkout;