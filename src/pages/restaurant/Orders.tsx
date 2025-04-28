import React from 'react';
import Sidebar from '../../components/Sidebar'; // Import Sidebar

// Define your routes for Sidebar
const routes: Record<string, { to: string; text: string; subpages?: { to: string; text: string }[] }[]> = {
  restaurant: [
    { to: '/restaurant/account-management', text: 'Hesap Yönetimi' },
    { to: '/restaurant/menu-management', text: 'Menü Yönetimi' },
    { to: '/restaurant/orders', text: 'Siparişler' },
    { to: '/restaurant/courier-management', text: 'Kurye Yönetimi' },
  ]
};

export default function Orders() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar routes={routes.restaurant} />

      {/* Main Content */}
      <div className="w-4/5 p-6">
        <h1>Merhaba, bu bir test sayfasıdır!</h1>
      </div>
    </div>
  );
}

