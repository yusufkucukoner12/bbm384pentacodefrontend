import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const RestaurantNavbar: React.FC = () => {
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('role');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };

  return (
    <nav className="w-full bg-yellow-50 shadow-md border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
        {/* Sol: İlk 2 Menü */}
        <div className="flex-1 flex justify-start gap-6 items-center">
          <Link
            to="/restaurant/account-management"
            className={linkClass(location.pathname === '/restaurant/account-management')}
          >
            Hesap Yönetimi
          </Link>
          <Link
            to="/restaurant/menu-management"
            className={linkClass(location.pathname === '/restaurant/menu-management')}
          >
            Menü Yönetimi
          </Link>
        </div>

        {/* Orta: Logo */}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <img src="/hurricane_image.png" alt="Logo" className="h-12 w-12" />
            <span className="text-xl font-bold text-orange-600">HURRICANE</span>
          </div>
        </div>

        {/* Sağ: Diğer 2 Menü + Çıkış */}
        <div className="flex-1 flex justify-end items-center gap-6">
          <Link
            to="/restaurant/orders"
            className={linkClass(location.pathname === '/restaurant/orders')}
          >
            Siparişler
          </Link>
          <Link
            to="/restaurant/courier-management"
            className={linkClass(location.pathname === '/restaurant/courier-management')}
          >
            Kurye Yönetimi
          </Link>
          <button onClick={handleLogout} className={linkClass()}>
            Çıkış Yap
          </button>
        </div>
      </div>
    </nav>
  );
};

const linkClass = (active: boolean = false) =>
  `px-4 py-2 rounded-md font-semibold text-red-700 transition-colors duration-200 ${
    active ? 'bg-orange-100' : 'hover:bg-orange-100'
  }`;

export default RestaurantNavbar;
