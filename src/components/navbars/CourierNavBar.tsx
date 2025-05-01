import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const CourierNavbar: React.FC = () => {
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
        {/* Sol: İlk 3 Menü */}
        <div className="flex-1 flex justify-start gap-6 items-center">
          <Link
            to="/courier/account-management"
            className={linkClass(location.pathname === '/courier/account-management')}
          >
            Hesap Yönetimi
          </Link>
          <Link
            to="/courier/assigned-orders"
            className={linkClass(location.pathname === '/courier/assigned-orders')}
          >
            Atanan Siparişler
          </Link>
          <Link
            to="/courier/idle-orders"
            className={linkClass(location.pathname === '/courier/idle-orders')}
          >
            Bekleyen Siparişler
          </Link>
        </div>

        {/* Orta: Logo */}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <img src="/hurricane_image.png" alt="Logo" className="h-12 w-12" />
            <span className="text-xl font-bold text-orange-600">HURRICANE</span>
          </div>
        </div>

        {/* Sağ: Son 2 Menü + Çıkış */}
        <div className="flex-1 flex justify-end items-center gap-6">
          <Link
            to="/courier/order-details"
            className={linkClass(location.pathname === '/courier/order-details')}
          >
            Sipariş Detayları
          </Link>
          <Link
            to="/courier/past-orders"
            className={linkClass(location.pathname === '/courier/past-orders')}
          >
            Geçmiş Siparişler
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

export default CourierNavbar;
