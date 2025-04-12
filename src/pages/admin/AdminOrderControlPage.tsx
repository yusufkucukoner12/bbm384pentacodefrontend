// components/admin/AdminOrderControlPage.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { OrderDTO, OrderStatusEnum } from '../../types/Order';
import { CourierDTO } from '../../types/Courier';
import GenericCard from '../../components/GenericCard';
import { NavbarForAdmin } from '../../components/admin/NavbarForAdmin';

export default function AdminOrderControlPage() {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [couriers, setCouriers] = useState<CourierDTO[]>([]);
  const [courierSearch, setCourierSearch] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/order/all');
        const ordersWithSearch = response.data.data.map((order: OrderDTO) => ({
          ...order,
          searchString: `${order.name} ${order.restaurant.name} ${order.menus.map((menu) => menu.name).join(' ')}`,
        }));
        setOrders(ordersWithSearch);
        setFilteredOrders(ordersWithSearch);
      } catch (err) {
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter(
      (order) =>
        order.searchString!.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedStatuses.length === 0 || selectedStatuses.includes(order.status))
    );
    setFilteredOrders(filtered);
  }, [searchQuery, selectedStatuses, orders]);

  const openCourierModal = async (orderId: number) => {
    setSelectedOrderId(orderId);
    try {
      const response = await axios.get('http://localhost:8080/api/couriers/available');
      setCouriers(response.data.data);
      setIsModalOpen(true);
    } catch (err) {
      setError('Failed to load couriers.');
    }
  };

  const assignCourier = async (orderId: number, courierId: number) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/admin/orders/${orderId}/assign-courier/${courierId}`
      );
      const updatedOrder = response.data.data;
      setOrders(orders.map((o) => (o.pk === orderId ? { ...o, ...updatedOrder } : o)));
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to assign courier.');
    }
  };

  const unassignCourier = async (orderId: number) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/admin/orders/${orderId}/unassign-courier`
      );
      const updatedOrder = response.data.data;
      setOrders(orders.map((o) => (o.pk === orderId ? { ...o, ...updatedOrder } : o)));
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to unassign courier.');
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50">
      <NavbarForAdmin />
      <div className="flex">
        <div className="w-4/5 p-4">
          <input
            type="text"
            placeholder="Search orders..."
            className="border rounded-lg p-2 w-full mb-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex flex-wrap gap-6">
            {loading
              ? Array(9)
                  .fill(0)
                  .map((_, index) => (
                    <GenericCard key={`loading-${index}`} title="" description="" loading={true} />
                  ))
              : filteredOrders.map((order) => (
                  <GenericCard
                    key={order.pk}
                    title={`Order #${order.pk}`}
                    description={`${order.restaurant.name} - Total: $${order.totalPrice.toFixed(2)}`}
                    imageUrl={order.restaurant.imageUrl}
                    children={
                      <div className="flex justify-between items-center mt-2">
                        <span
                          className={`px-2 py-1 rounded ${
                            order.status === OrderStatusEnum.READY_FOR_PICKUP
                              ? 'bg-yellow-200'
                              : order.status === OrderStatusEnum.ASSIGNED
                              ? 'bg-blue-200'
                              : order.status === OrderStatusEnum.DELIVERED
                              ? 'bg-green-200'
                              : 'bg-gray-200'
                          }`}
                        >
                          {order.status}
                        </span>
                        {(order.status === OrderStatusEnum.READY_FOR_PICKUP ||
                          order.status === OrderStatusEnum.ASSIGNED) && (
                          <button
                            className="text-orange-700 hover:underline"
                            onClick={() => openCourierModal(order.pk)}
                          >
                            {order.status === OrderStatusEnum.READY_FOR_PICKUP ? 'Assign Courier' : 'Manage Courier'}
                          </button>
                        )}
                      </div>
                    }
                  />
                ))}
          </div>
        </div>
        <div className="w-1/5 p-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-2">Filter by Status</h3>
            <div className="space-y-2">
              {Object.values(OrderStatusEnum).map((status) => (
                <label key={status} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedStatuses.includes(status)}
                    onChange={() =>
                      setSelectedStatuses((prev) =>
                        prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
                      )
                    }
                    className="mr-2"
                  />
                  {status}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h3 className="text-lg font-bold mb-4">Manage Courier for Order #{selectedOrderId}</h3>
            <input
              type="text"
              placeholder="Search couriers..."
              className="border rounded-lg p-2 w-full mb-4"
              value={courierSearch}
              onChange={(e) => setCourierSearch(e.target.value)}
            />
            <div className="max-h-64 overflow-y-auto">
              {couriers
                .filter((c) => c.name.toLowerCase().includes(courierSearch.toLowerCase()))
                .map((courier) => (
                  <div key={courier.pk} className="flex justify-between items-center py-2 border-b">
                    <span>
                      {courier.name} ({courier.phoneNumber})
                    </span>
                    <button
                      className={`px-3 py-1 rounded ${
                        orders.find((o) => o.pk === selectedOrderId)?.courier?.pk === courier.pk
                          ? 'bg-green-500 text-white'
                          : 'bg-orange-700 text-white'
                      }`}
                      onClick={() => assignCourier(selectedOrderId!, courier.pk)}
                      disabled={orders.find((o) => o.pk === selectedOrderId)?.courier?.pk === courier.pk}
                    >
                      {orders.find((o) => o.pk === selectedOrderId)?.courier?.pk === courier.pk
                        ? 'Assigned'
                        : 'Assign'}
                    </button>
                  </div>
                ))}
            </div>
            {orders.find((o) => o.pk === selectedOrderId)?.courier && (
              <button
                className="mt-4 text-red-600 hover:underline"
                onClick={() => unassignCourier(selectedOrderId!)}
              >
                Unassign Courier
              </button>
            )}
            <button
              className="mt-4 ml-4 text-gray-600 hover:underline"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}