import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import CustomerNavbar from '../../components/navbars/CustomerNavBar'; 


interface MenuItem {
  pk: number;
  name: string;
  price: number;
}

interface OrderItem {
  menu: MenuItem;
  quantity: number;
}

interface Order {
  pk: number;
  orderItems: OrderItem[];
  createdAt: string;
}

interface ApiResponse {
  data: Order[];
}

const ActiveOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const old = searchParams.get('old') === 'true'; // Get the `old` query param, converted to boolean

  const fetchActiveOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get<ApiResponse>(
        `http://localhost:8080/api/customer/get-active-orders?old=${old}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(res.data.data || []);
    } catch (err) {
      setError('❌ Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (order: Order) => {
    return order.orderItems.reduce((sum, item) => {
      const price = item.menu.price ?? 0;
      const qty = item.quantity ?? 0;
      return sum + price * qty;
    }, 0);
  };

  useEffect(() => {
    fetchActiveOrders();
  }, [old]);

  return (

    <div className="min-h-screen bg-orange-50 py-10">
      <CustomerNavbar /> 
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-[#1f1f1f] rounded-2xl shadow-xl text-white font-semibold">
        <h1 className="text-4xl text-orange-400 mb-8 border-b-2 border-orange-500 pb-4">
          📦 {old ? 'Old Orders' : 'Your Active Orders'}
        </h1>

        {loading ? (
          <p className="text-orange-300 text-lg">⏳ Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-orange-300 text-lg">
            🛒 {old ? 'No old orders found.' : 'You have no active orders.'}
          </p>
        ) : (
          <div className="space-y-10">
            {orders.map((order) => (
              <div key={order.pk} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl text-orange-300">Order #{order.pk}</h2>
                  <p className="text-sm text-orange-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                {order.orderItems.map((item) => (
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
                    ${calculateTotal(order).toFixed(2)}
                  </span>
                </div>

                <div className="border-b border-orange-800 pb-4" />
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-red-400 mt-6 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default ActiveOrdersPage;
