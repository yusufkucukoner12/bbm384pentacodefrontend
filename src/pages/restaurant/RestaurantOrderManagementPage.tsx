// components/pages/restaurant/RestaurantOrderManagementPage.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { OrderDTO, OrderStatusEnum } from '../../types/Order';
import { NavbarForRestaurant } from '../../components/restaurants/NavbarForRestaurant';
import { OrderSearch } from '../../components/admin/OrderSearch';
import { OrderStatusFilter } from '../../components/admin/OrderStatusFilter';
import { RestaurantOrderList } from '../../components/restaurants/RestaurantOrderList';
import { UpdateOrderStatusModal } from '../../components/restaurants/UpdateOrderStatusModal';

export default function RestaurantOrderManagementPage() {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  
  // Hard-coded restaurant ID (in a real app, this would come from authentication)
  const restaurantId = 1;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/restaurant/get/orders`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const ordersWithSearch = response.data.data.map((order: OrderDTO) => ({
          ...order,
          searchString: `${order.name} ${order.restaurant.name} ${order.orderItems.map((item) => item.menu.name).join(' ')}`,
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
  }, [restaurantId]);

  useEffect(() => {
    const filtered = orders.filter(
      (order) =>
        order.searchString!.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedStatuses.length === 0 || selectedStatuses.includes(order.status))
    );
    setFilteredOrders(filtered);
  }, [searchQuery, selectedStatuses, orders]);

  const openUpdateStatusModal = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/restaurant/orders/${orderId}/status`,
        { status: newStatus},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },}
      );
      const updatedOrder = response.data.data;
      setOrders(orders.map((o) => (o.pk === orderId ? { ...o, ...updatedOrder } : o)));
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to update order status.');
    }
  };

  const assignCourier = async (orderId: number, courierId: number) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/restaurant/orders/${orderId}/assign-courier/${courierId}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },}
      );
      const updatedOrder = response.data.data;
      setOrders(orders.map((o) => (o.pk === orderId ? { ...o, ...updatedOrder } : o)));
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to assign courier.');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-yellow-50">
      <NavbarForRestaurant />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-orange-700 mb-4">Order Management</h1>
        
        <div className="flex">
          <div className="w-4/5 p-4">
            <OrderSearch 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
            />
            
            {error && <p className="text-red-500 mb-4">{error}</p>}
            
            <RestaurantOrderList 
              orders={filteredOrders} 
              loading={loading} 
              openUpdateStatusModal={openUpdateStatusModal} 
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
          <UpdateOrderStatusModal 
            orderId={selectedOrderId}
            orders={orders}
            onUpdateStatus={updateOrderStatus}
            onAssignCourier={assignCourier}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
}