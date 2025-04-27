import React from 'react';
import Sidebar from '../../components/Sidebar'; // Import Sidebar

// Define your routes for Sidebar
const routes: Record<string, { to: string; text: string; subpages?: { to: string; text: string }[] }[]> = {
  courier: [
    { to: '/courier/account-management', text: 'Hesap Yönetimi' },
    { to: '/courier/assigned-orders', text: 'Atanan Siparişler' },
    { to: '/courier/idle-orders', text: 'Bekleyen Siparişler' },
    { to: '/courier/order-details', text: 'Sipariş Detayları' },
    { to: '/courier/past-orders', text: 'Geçmiş Siparişler' },
  ]
};

export default function AssignedOrders() {
  return (
    <div className="flex">
      {/* Sidebar for courier */}
      <Sidebar routes={routes.courier} />

      {/* Main Content */}
      <div className="w-4/5 p-6">
        <h1>Merhaba, bu bir test sayfasıdır!</h1>
      </div>
    </div>
  );
}
