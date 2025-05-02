import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [filteredItems, setFilteredItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

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
      const items = res.data.data.orderItems || [];
      setOrderItems(items);
      filterItems(items, searchQuery);
    } catch (err) {
      setError('Failed to load cart');
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = async (pk: number, action: 'add' | 'remove') => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8080/api/customer/update-order/${pk}?action=${action}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchOrder();
      toast.success(`Item ${action === 'add' ? 'added' : 'removed'} successfully`);
    } catch (err) {
      setError('Failed to update cart');
      toast.error('Failed to update cart');
    }
  };

  const handleQuantityChange = async (pk: number, quantity: number) => {
    if (quantity < 1) return;
    try {
      const token = localStorage.getItem('token');
      const currentItem = orderItems.find((item) => item.menu.pk === pk);
      if (!currentItem) return;
      const delta = quantity - currentItem.quantity;
      if (delta === 0) return;
      const action = delta > 0 ? 'add' : 'remove';
      const absDelta = Math.abs(delta);
      for (let i = 0; i < absDelta; i++) {
        await axios.post(
          `http://localhost:8080/api/customer/update-order/${pk}?action=${action}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      await fetchOrder();
      toast.success(`Quantity updated to ${quantity}`);
    } catch (err) {
      setError('Failed to update quantity');
      toast.error('Failed to update quantity');
    }
  };

  const placeOrder = async () => {
    setPlacingOrder(true);
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
      toast.success('Order placed successfully!');
      navigate('/success', {
        state: {
          message: 'Order placed successfully!',
          redirectTo: '/customer/restaurants',
        },
      });
    } catch (err) {
      setError('Failed to place order');
      toast.error('Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  const calculateTotal = () => {
    return filteredItems.reduce((sum, item) => {
      const price = item.menu.price ?? 0;
      const qty = item.quantity ?? 0;
      return sum + price * qty;
    }, 0);
  };

  const filterItems = (items: OrderItem[], query: string) => {
    if (!query) {
      setFilteredItems(items);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = items.filter((item) =>
      item.menu.name.toLowerCase().includes(lowerQuery)
    );
    setFilteredItems(filtered);
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  useEffect(() => {
    filterItems(orderItems, searchQuery);
  }, [searchQuery, orderItems]);

  return (
    <div className="min-h-screen bg-orange-50">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-red-700 mb-6">Review Your Cart</h1>

        {/* Sticky Header */}
        <div className="sticky top-0 bg-orange-50 z-10 pb-4">
          <div className="flex items-center w-full mb-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search cart items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-amber-600 rounded px-3 py-2 pl-10 focus:ring-2 focus:ring-orange-700 text-amber-800 placeholder-amber-400"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-amber-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-amber-800"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {Array(4).fill(0).map((_, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg p-5 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <img
              src="https://via.placeholder.com/200?text=No+Items"
              alt="No items"
              className="mx-auto mb-4"
            />
            <p className="text-amber-800 text-lg">Your cart is empty.</p>
            <button
              onClick={() => navigate('/customer/restaurants')}
              className="mt-4 px-4 py-2 bg-orange-700 text-white rounded hover:bg-orange-800 transition"
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.menu.pk}
                className="bg-white shadow-md rounded-lg p-5 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-amber-800 text-lg">{item.menu.name}</p>
                    <p className="text-sm text-amber-600">Price: ${item.menu.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleUpdateOrder(item.menu.pk, 'remove')}
                      className="bg-amber-800 text-white rounded w-8 h-8 flex items-center justify-center hover:bg-amber-900 transition"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.menu.pk, parseInt(e.target.value) || 1)
                      }
                      min="1"
                      className="w-12 text-center border border-amber-600 rounded px-2 py-1 text-amber-800 focus:ring-2 focus:ring-orange-700"
                    />
                    <button
                      onClick={() => handleUpdateOrder(item.menu.pk, 'add')}
                      className="bg-amber-800 text-white rounded w-8 h-8 flex items-center justify-center hover:bg-amber-900 transition"
                    >
                      +
                    </button>
                    <span className="text-amber-800 text-lg">
                      ${(item.menu.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div className="max-w-2xl mx-auto sticky bottom-0 bg-orange-50 pt-4 pb-6 z-10">
              <div className="flex justify-between items-center mb-4 border-t border-amber-200 pt-4">
                <span className="text-amber-800 font-semibold text-lg">Total:</span>
                <span className="text-amber-800 font-bold text-lg">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
              <button
                onClick={placeOrder}
                disabled={placingOrder}
                className="w-full bg-orange-700 text-white font-bold py-3 rounded-lg hover:bg-orange-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {placingOrder ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default ReviewCartPage;