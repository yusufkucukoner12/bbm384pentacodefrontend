// components/admin/OrderList.tsx
import React from 'react';
import { OrderDTO, OrderStatusEnum } from '../../types/Order';
import GenericCard from '../GenericCard';

interface OrderListProps {
  orders: OrderDTO[];
  loading: boolean;
  openCourierModal: (orderId: number) => void;
}

export const OrderList: React.FC<OrderListProps> = ({ orders, loading, openCourierModal }) => {
  if (loading) {
    return (
      <div className="flex flex-wrap gap-6">
        {Array(9)
          .fill(0)
          .map((_, index) => (
            <GenericCard key={`loading-${index}`} title="" description="" loading={true} />
          ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-6">
      {orders.map((order) => (
        <OrderCard 
          key={order.pk} 
          order={order} 
          openCourierModal={openCourierModal} 
        />
      ))}
    </div>
  );
};

interface OrderCardProps {
  order: OrderDTO;
  openCourierModal: (orderId: number) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, openCourierModal }) => {
  const getStatusBackgroundColor = (status: string) => {
    switch (status) {
      case OrderStatusEnum.READY_FOR_PICKUP:
        return 'bg-yellow-200';
      case OrderStatusEnum.ASSIGNED:
        return 'bg-blue-200';
      case OrderStatusEnum.DELIVERED:
        return 'bg-green-200';
      default:
        return 'bg-gray-200';
    }
  };

  const canManageCourier = 
    order.status === OrderStatusEnum.READY_FOR_PICKUP || 
    order.status === OrderStatusEnum.ASSIGNED;

  return (
    <GenericCard
      title={`Order #${order.pk}`}
      description={`${order.restaurant.name} - Total: $${order.totalPrice.toFixed(2)}`}
      imageUrl={order.restaurant.imageUrl}
    >
      <div className="flex justify-between items-center mt-2">
        <span className={`px-2 py-1 rounded ${getStatusBackgroundColor(order.status)}`}>
          {order.status}
        </span>
        {canManageCourier && (
          <button
            className="text-orange-700 hover:underline"
            onClick={() => openCourierModal(order.pk)}
          >
            {order.status === OrderStatusEnum.READY_FOR_PICKUP ? 'Assign Courier' : 'Manage Courier'}
          </button>
        )}
      </div>
    </GenericCard>
  );
};