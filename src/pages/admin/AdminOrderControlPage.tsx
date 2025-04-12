// components/admin/AdminOrderControlPage.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { OrderDTO, OrderStatusEnum } from '../../types/Order';
import { CourierDTO } from '../../types/Courier';
import { NavbarForAdmin } from '../../components/admin/NavbarForAdmin';
import { OrderSearch } from '../../components/admin/OrderSearch';
import { OrderStatusFilter } from '../../components/admin/OrderStatusFilter';
import { OrderList } from '../../components/admin/OrderList';
import { AssignCourierModal } from '../../components/admin/AssignCourierModal';

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-yellow-50">
      <NavbarForAdmin />
      <div className="flex">
        <div className="w-4/5 p-4">
          <OrderSearch 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
          />
          
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          <OrderList 
            orders={filteredOrders} 
            loading={loading} 
            openCourierModal={openCourierModal} 
          />
        </div>
        
        <div className="w-1/5 p-4">
          <OrderStatusFilter 
            selectedStatuses={selectedStatuses} 
            setSelectedStatuses={setSelectedStatuses} 
          />
        </div>
      </div>
      
      {isModalOpen && selectedOrderId && (
        <AssignCourierModal 
          orderId={selectedOrderId}
          orders={orders}
          couriers={couriers}
          onAssign={assignCourier}
          onUnassign={unassignCourier}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}