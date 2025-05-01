import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface MenuItem {
  pk: number;
  name: string;
  price: number;
}

interface OrderItem {
  menu: MenuItem;
  quantity: number;
}

interface OrderData {
  data: {
    orderItems: OrderItem[];
  };
}

const ReviewCartPage: React.FC = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get<OrderData>(
        'http://localhost:8080/api/customer/get-order',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrderItems(res.data.data.orderItems || []);
    } catch (err) {
      setError('❌ Failed to load order');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async () => {
    setPlacingOrder(true);
    setMessage('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8080/api/customer/place-order',
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('✅ Order placed successfully!');
      setOrderItems([]);
    } catch (err) {
      setError('❌ Failed to place order');
      console.error(err);
    } finally {
      setPlacingOrder(false);
    }
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => {
      const price = item.menu.price ?? 0;
      const qty = item.quantity ?? 0;
      return sum + price * qty;
    }, 0);
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <div className="min-h-screen bg-orange-50 py-10">
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-[#1f1f1f] rounded-2xl shadow-xl text-white font-semibold">
        <h1 className="text-4xl text-orange-400 mb-8 border-b-2 border-orange-500 pb-4">
          🛒 Review Your Cart
        </h1>

        {loading ? (
          <p className="text-orange-300 text-lg">⏳ Loading your cart...</p>
        ) : orderItems.length === 0 ? (
          <p className="text-orange-300 text-lg">🛒 Your cart is empty.</p>
        ) : (
          <div className="space-y-6">
            {orderItems.map((item) => (
              <div
                key={item.menu.pk}
                className="flex justify-between items-center bg-[#2a2a2a] rounded-lg px-4 py-3 border border-orange-500"
              >
                <div>
                  <p className="text-lg text-orange-300">{item.menu.name}</p>
                  <p className="text-sm text-orange-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-orange-200 text-lg">
                  ${(item.menu.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}

            <div className="flex justify-between items-center mt-4 border-t border-orange-600 pt-4 text-xl">
              <span className="text-orange-400">Total:</span>
              <span className="text-orange-200 font-bold">
                ${calculateTotal().toFixed(2)}
              </span>Qty: 47
            </div>

            <button
              onClick={placeOrder}
              disabled={placingOrder}
              className="w-full bg-orange-500 hover:bg-orange-600 transition-all text-white font-bold py-3 rounded-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {placingOrder ? '🚚 Placing Order...' : '✅ Place Order'}
            </button>

            {message && <p className="text-green-400 mt-4 text-center">{message}</p>}
            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCartPage;
