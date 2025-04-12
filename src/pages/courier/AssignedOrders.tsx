import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { OrderDTO, OrderStatusEnum } from '../../types/Order';

export default function AcceptedOrders() {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const courierId = 145331; // Assuming this is the courierId for this session

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/order/courier/${courierId}`,
          { params: { accept: true } }
        );
        const acceptedOrders = response.data.data.filter((order: OrderDTO) =>
          order.status === OrderStatusEnum.IN_TRANSIT
        );
        setOrders(response.data.data);
      } catch (err) {
        setError('Failed to fetch accepted orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center mt-5">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5 sm:px-10">
      <h1 className="text-3xl font-semibold text-center mb-6">Accepted Orders</h1>
      {loading ? (
        <div className="flex justify-center items-center space-x-2">
          <div className="w-8 h-8 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <span className="text-xl text-gray-600">Loading accepted orders...</span>
        </div>
      ) : (
        <ul className="space-y-6">
          {orders.length === 0 ? (
            <div className="text-center text-gray-500">No accepted orders found.</div>
          ) : (
            orders.map((order) => (
              <li
                key={order.pk}
                className="bg-white shadow-md rounded-lg p-5 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-medium text-gray-800">Order ID: {order.pk}</h2>
                  <span
                    className={`px-3 py-1 rounded-full text-white ${
                      order.status === OrderStatusEnum.IN_TRANSIT
                        ? 'bg-blue-500'
                        : 'bg-green-500'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Restaurant Info */}
                <div className="mt-3 text-gray-600">
                  <p className="font-semibold">Restaurant: {order.restaurant.name}</p>
                  <p className="text-sm text-gray-500">Version: {order.restaurant.version}</p>
                </div>

                {/* Menu Items */}
                <div className="mt-3">
                  <p className="font-semibold">Menu Items:</p>
                  <ul className="space-y-2">
                    {order.menus.map((menu, index) => (
                      <li key={index} className="text-gray-600">
                        <span className="font-medium">{menu.name}</span> - ${menu.price.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Total Price */}
                <div className="mt-3 text-gray-800">
                  <p className="font-semibold">Total Price: ${order.totalPrice.toFixed(2)}</p>
                </div>

                {/* Additional Info */}
                <div className="mt-3 text-gray-600">
                  <p className="font-semibold">Courier: {order.courier ? order.courier.name : 'No courier assigned'}</p>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
