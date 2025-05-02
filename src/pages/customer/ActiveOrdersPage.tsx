import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
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
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const old = searchParams.get('old') === 'true';

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
      const fetchedOrders = res.data.data || [];
      setOrders(fetchedOrders);
      filterAndSortOrders(fetchedOrders, searchQuery, sortOption);
    } catch (err) {
      setError('Failed to load orders');
      toast.error('Failed to load orders');
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

  const filterAndSortOrders = (orders: Order[], query: string, sort: string) => {
    let result = [...orders];

    // Search filter
    if (query) {
      const lowerQuery = query.toLowerCase();
      result = result.filter(
        (order) =>
          order.pk.toString().includes(lowerQuery) ||
          order.orderItems.some((item) =>
            item.menu.name.toLowerCase().includes(lowerQuery)
          )
      );
    }

    // Sorting
    if (sort === 'date-desc') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'date-asc') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sort === 'total-asc') {
      result.sort((a, b) => calculateTotal(a) - calculateTotal(b));
    } else if (sort === 'total-desc') {
      result.sort((a, b) => calculateTotal(b) - calculateTotal(a));
    }

    setFilteredOrders(result);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchActiveOrders();
  }, [old]);

  useEffect(() => {
    filterAndSortOrders(orders, searchQuery, sortOption);
  }, [searchQuery, sortOption, orders]);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-orange-50">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-red-700 mb-6">
          {old ? 'Old Orders' : 'Your Active Orders'}
        </h1>

        {/* Sticky Header */}
        <div className="sticky top-0 bg-orange-50 z-10 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
            <div className="flex items-center w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search orders..."
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
            <div className="flex space-x-4">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border border-amber-600 rounded px-3 py-2 focus:ring-2 focus:ring-orange-700 text-amber-800"
              >
                <option value="date-desc">Sort: Newest First</option>
                <option value="date-asc">Sort: Oldest First</option>
                <option value="total-asc">Sort: Total (Low-High)</option>
                <option value="total-desc">Sort: Total (High-Low)</option>
              </select>
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg p-5 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <img
              src="https://via.placeholder.com/200?text=No+Orders"
              alt="No orders"
              className="mx-auto mb-4"
            />
            <p className="text-amber-800 text-lg">
              {old ? 'No old orders found.' : 'You have no active orders.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedOrders.map((order) => (
                <div
                  key={order.pk}
                  className="bg-white shadow-md rounded-lg p-5 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium text-amber-800">Order #{order.pk}</h2>
                    <p className="text-sm text-amber-600">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {order.orderItems.map((item) => (
                    <div
                      key={item.menu.pk}
                      className="flex justify-between items-center mb-3 border-b border-amber-200 pb-2"
                    >
                      <div>
                        <p className="text-amber-800">{item.menu.name}</p>
                        <p className="text-sm text-amber-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-amber-800">
                        ${(item.menu.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-amber-200">
                    <span className="text-amber-800 font-semibold">Total:</span>
                    <span className="text-amber-800 font-bold">
                      ${calculateTotal(order).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-6">
              <p className="text-amber-800">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of{' '}
                {filteredOrders.length} orders
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-amber-800 text-white rounded disabled:bg-gray-300"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, Math.ceil(filteredOrders.length / itemsPerPage))
                    )
                  }
                  disabled={currentPage === Math.ceil(filteredOrders.length / itemsPerPage)}
                  className="px-3 py-1 bg-amber-800 text-white rounded disabled:bg-gray-300"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default ActiveOrdersPage;